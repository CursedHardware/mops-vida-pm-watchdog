export class ShutdownPacket {
  public constructor(data: Buffer) {
    assert(data, 0x01);
  }
}

export class MeasurementIntervalPacket {
  public readonly interval: number;

  public constructor(data: Buffer) {
    assert(data, 0x08);
    this.interval = data.readUInt32BE(0x2);
  }
}

export class SetRTCPacket {
  public readonly date: Date;

  public constructor(data: Buffer) {
    assert(data, 0x09);
    this.date = new Date(data.readUInt32BE(0x2) * 1000);
  }
}

export class NoMoreHistoryPacket {
  public constructor(data: Buffer) {
    assert(data, 0x0a);
  }
}

export class HistoryPacket {
  public readonly pm25: number;
  public readonly recordDate: Date;

  public constructor(data: Buffer) {
    assert(data, 0x0b);
    this.pm25 = data.readUInt16BE(0x2);
    this.recordDate = new Date(data.readUInt32BE(0x6) * 1000);
  }
}

export class MeasurementEnabledPacket {
  public readonly enabled: boolean;

  public constructor(data: Buffer) {
    assert(data, 0x16);
    this.enabled = Boolean(data.readUInt8(0x2));
  }
}

export class BatteryPacket {
  public readonly capacity: number;
  public readonly isCharging: boolean;

  public constructor(data: Buffer) {
    assert(data, 0x50);
    this.capacity = data.readUInt8(0x3);
    this.isCharging = Boolean(data.readUInt8(0x6));
    Object.freeze(this);
    Object.seal(this);
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
}

export class MeasurementSetupPacket {
  public readonly interval: number;
  public readonly enabled: boolean;

  public constructor(data: Buffer) {
    assert(data, 0x50);
    this.interval = data.readUInt16BE(0x3);
    this.enabled = Boolean(data.readUInt8(0x5));
    Object.freeze(this);
    Object.seal(this);
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
  aa08: MeasurementIntervalPacket,
  aa09: SetRTCPacket,
  aa0a: NoMoreHistoryPacket,
  aa0b: HistoryPacket,
  aa16: MeasurementEnabledPacket,
  aa5004: BatteryPacket,
  aa5005: RuntimePacket,
  aa5006: SensorPacket,
  aa5007: MeasurementSetupPacket,
  aa54: VersionPacket,
};

export type PacketType = InstanceType<typeof mapping[keyof typeof mapping]>;

export function readPacket(block: Buffer): PacketType | undefined {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const Packet = mapping[block.slice(0, 3).toString('hex')] || mapping[block.slice(0, 2).toString('hex')];
  return new Packet(block);
}
