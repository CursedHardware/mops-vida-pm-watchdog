import { assert } from 'chai';
import 'mocha';
import { describe } from 'mocha';
import { readPacket, PacketType } from './packets';

describe('Packets', () => {
  const cases: Record<string, PacketType> = {
    AA01AB: {},
    AA0A01B5: {},
    AA0B004900005F509AFE45: { pm25: 18688, recordDate: new Date('2012-11-08T00:35:17.000Z') },
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
