import { EventEmitter } from 'events';
import { RX_SERVICE_UUID, RX_CHAR_UUID, TX_CHAR_UUID } from './constants';
import { PacketType, readPacket } from './packets';
export * as Commands from './commands';
export * from './packets';

const DISCONNECTED = 'gattserverdisconnected';
const VALUE_CHANGED = 'characteristicvaluechanged';

const enum EventType {
  disconnected = 'disconnected',
  packet = 'packet',
  failed = 'failed',
}

interface Events {
  disconnected(): void;
  packet(packet: PacketType): void;
  failed(packet: Buffer): void;
}

export class SensorService {
  public static async requestDevice() {
    const device = await navigator.bluetooth.requestDevice({
      filters: [{ services: [0x7676] }],
      optionalServices: [RX_SERVICE_UUID],
    });
    return new SensorService(device);
  }

  private events = new EventEmitter();
  private device: BluetoothDevice;
  private server?: BluetoothRemoteGATTServer;

  private constructor(device: BluetoothDevice) {
    this.device = device;
    device.addEventListener(DISCONNECTED, () => {
      this.events.emit(EventType.disconnected);
    });
  }

  public async connect() {
    this.server = await this.device.gatt?.connect();
    if (this.server === undefined) {
      return;
    }
    const service = await this.server.getPrimaryService(RX_SERVICE_UUID);
    const characteristic = await service.getCharacteristic(TX_CHAR_UUID);
    characteristic.addEventListener(VALUE_CHANGED, this.handleValueChanged);
    await characteristic.startNotifications();
  }

  public async disconnect() {
    try {
      this.device.gatt?.disconnect();
    } catch {
      // ignore
    }
    this.events.removeAllListeners();
  }

  public async sendCommand(block: Buffer) {
    const service = await this.server?.getPrimaryService(RX_SERVICE_UUID);
    if (service === undefined) {
      return;
    }
    const characteristic = await service.getCharacteristic(RX_CHAR_UUID);
    await characteristic.writeValue(block);
  }

  public on<K extends keyof Events>(event: K, listener: Events[K]): () => void;
  public on(event: string, listener: (...args: unknown[]) => void) {
    this.events.on(event, listener);
    return () => {
      this.events.off(event, listener);
    };
  }

  private handleValueChanged = (event: Event) => {
    const target = event.target as BluetoothRemoteGATTCharacteristic;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.emitBlock(Buffer.from(target.value!.buffer));
  };

  private emitBlock(block: Buffer) {
    try {
      const packet = readPacket(block);
      if (packet === undefined) {
        this.events.emit(EventType.failed, block);
      } else {
        this.events.emit(EventType.packet, packet);
      }
    } catch {
      this.events.emit(EventType.failed, block);
    }
  }
}
