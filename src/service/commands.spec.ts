import { assert, use } from 'chai';
import chaiBytes from 'chai-bytes';
import 'mocha';
import { describe } from 'mocha';

import * as cmds from './commands';

use(chaiBytes);

describe('Commands', () => {
  const cases: Record<string, Buffer> = {
    AA01AB: cmds.shutdown(),
    AA080005B7: cmds.setMeasurementInterval(5),
    AA0800782A: cmds.setMeasurementInterval(120),
    AA095F492A981D: cmds.setRTC(new Date('2020-08-28T16:02:32.000Z')),
    AA0AB4: cmds.readHistory(),
    AA0BB5: cmds.nextHistory(),
    AA1600C0: cmds.setMeasurementEnable(false),
    AA1601C1: cmds.setMeasurementEnable(true),
  };
  for (const [expected, packet] of Object.entries(cases)) {
    it(expected, () => {
      assert.equalBytes(packet, expected);
    });
  }
});
