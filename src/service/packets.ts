export class ShutdownPacket {
  public constructor(data: Buffer) {
    assert(data, 0x01);
  }

  public toString() {
    return 'Shutdown';
  }
}

export class NoMoreHistoryPacket {
  public constructor(data: Buffer) {
    assert(data, 0x0a);
  }

  public toString() {
    return 'No More History';
  }
}

export class HistoryPacket {
  public readonly pm25: number;
  public readonly recordDate: Date;

  public constructor(data: Buffer) {
    assert(data, 0x0b);
    this.pm25 = data.readUInt16BE(0x2);
    this.recordDate = new Date(data.readUInt32BE(0x7) * 1000);
  }

  public toString() {
    return `PM 2.5: ${this.pm25}`;
  }
}

export class BatteryPacket {
  public readonly capacity: number;
  public readonly isCharging: boolean;

  public constructor(data: Buffer) {
    assert(data, 0x50);
    this.capacity = data.readUInt8(0x3);
    this.isCharging = data.readUInt8(0x6) === 1;
    Object.freeze(this);
    Object.seal(this);
  }

  public toString() {
    if (this.isCharging) {
      return 'Charging';
    }
    return `Battery: ${this.capacity}%`;
  }
}

export class RuntimePacket {
  public readonly runtime: number;
  public readonly boottime: number;

  public constructor(data: Buffer) {
    assert(data, 0x50);
    this.runtime = data.readUInt32BE(0x3);
    this.boottime = data.readUInt32BE(0x7);
    Object.freeze(this);
    Object.seal(this);
  }

  public toString() {
    return `Run time: ${this.runtime} sec, Boot time: ${this.boottime} sec`;
  }
}

export class SensorPacket {
  public readonly pm25: number;
  public readonly recordDate: Date;
  public readonly currentDate: Date;

  public constructor(data: Buffer) {
    assert(data, 0x50);
    this.pm25 = data.readUInt16BE(0x3);
    this.recordDate = new Date(data.readUInt32BE(0x7) * 1000);
    this.currentDate = new Date(data.readUInt32BE(0xc) * 1000);
    Object.freeze(this);
    Object.seal(this);
  }

  public toString() {
    return `PM 2.5: ${this.pm25}`;
  }
}

export class MeasurementSetupPacket {
  public readonly interval: number;
  public readonly enabled: boolean;

  public constructor(data: Buffer) {
    assert(data, 0x50);
    this.interval = data.readUInt16BE(0x3);
    this.enabled = data.readUInt8(0x5) !== 0;
    Object.freeze(this);
    Object.seal(this);
  }

  public toString() {
    if (!this.enabled) {
      return 'Interval measurement disabled';
    }
    return `Internal: ${this.interval} minutes`;
  }
}

export class VersionPacket {
  public readonly major: number;
  public readonly minor: number;

  public constructor(data: Buffer) {
    assert(data, 0x54);
    this.minor = data.readUInt16BE(0x2);
    this.major = data.readUInt16BE(0x4);
    Object.freeze(this);
    Object.seal(this);
  }

  public toString() {
    return `${this.major}.${this.minor}`;
  }
}

function assert(data: Buffer, type: number) {
  if (data[0] !== 0xaa) {
    throw new Error('unexpected header');
  } else if (data[1] !== type) {
    throw new Error('unexpected type');
  }
}

const mapping = {
  aa01: ShutdownPacket,
  aa0a: NoMoreHistoryPacket,
  aa0b: HistoryPacket,
  aa5004: BatteryPacket,
  aa5005: RuntimePacket,
  aa5006: SensorPacket,
  aa5007: MeasurementSetupPacket,
  aa5400: VersionPacket,
};

export type PacketType = InstanceType<typeof mapping[keyof typeof mapping]>;

export function readPacket(block: Buffer): PacketType | undefined {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const Packet = mapping[block.slice(0, 3).toString('hex')] || mapping[block.slice(0, 2).toString('hex')];
  return new Packet(block);
}
