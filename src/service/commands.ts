export function shutdown() {
  return makePacket(0x01);
}

export function setMeasurementInterval(interval: number) {
  return makePacket(0x08, Buffer.of(0x00, interval));
}

export function setTime(now = new Date()) {
  const values = Buffer.alloc(4);
  values.writeUInt32BE(Math.trunc(now.getTime() / 1000));
  return makePacket(0x09, values);
}

export function readHistory() {
  return makePacket(0x0a);
}

export function nextHistory() {
  return makePacket(0x0b);
}

export function setMeasurementEnable(enabled: boolean) {
  return makePacket(0x16, Buffer.of(enabled ? 0x01 : 0x00));
}

function makePacket(type: number, values = Buffer.of()) {
  const header = Buffer.of(0xaa, type);
  const payload = Buffer.concat([header, values]);
  const checksum = payload.reduce((prev, curr) => prev + curr, 0);
  return Buffer.of(...payload, checksum);
}
