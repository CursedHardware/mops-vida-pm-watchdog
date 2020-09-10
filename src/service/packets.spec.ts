import { assert } from 'chai';
import 'mocha';
import { describe } from 'mocha';
import { readPacket, PacketType } from './packets';

describe('Packets', () => {
  const cases: Record<string, PacketType> = {
    AA01AB: {},
    AA0800000005B7: { interval: 5 },
    AA095F5A2FE883: { date: new Date('2020-09-10T13:53:44.000Z') },
    AA0A01B5: {},
    AA1601C1: { enabled: true },
    AA1600C0: { enabled: false },
    AA0B004900005F509AFE45: { pm25: 73, recordDate: new Date('2020-09-03T07:27:58.000Z') },
    AA0B01B800005F5073D767: { pm25: 440, recordDate: new Date('2020-09-03T04:40:55.000Z') },
    AA500464640000000000000000000000000000C6: { capacity: 100, isCharging: false },
    AA50050001F55600006310000000000000BE: { runtime: 128342, boottime: 25360 },
    AA5006001E00005F52358C025F52358D05: { pm25: 30, recordDate: new Date('2020-09-04T12:39:40.000Z'), currentDate: new Date('2020-09-04T12:39:41.000Z') },
    AA500700050006: { interval: 5, enabled: false },
    AA5400100001000110: { major: 1, minor: 16 },
  };

  for (const [packet, expected] of Object.entries(cases)) {
    it(packet, () => {
      const parsed = readPacket(Buffer.from(packet, 'hex'));
      assert.deepEqual(expected, parsed);
    });
  }
});
