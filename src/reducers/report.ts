import { produce } from 'immer';
import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { setConnected, updatePacket } from '../actions/sensor';
import {
  BatteryPacket,
  HistoryPacket,
  MeasurementSetupPacket,
  NoMoreHistoryPacket,
  RuntimePacket,
  SensorPacket,
  ShutdownPacket,
  VersionPacket,
} from '../service';

export interface ReportState {
  connected: boolean;
  shuttingdown: boolean;

  latest: Report;

  history: Report[];
  historyFully: boolean;
}

interface Report {
  batteryCapacity?: number;
  batteryCharging?: boolean;

  measurementInterval?: number;
  measurementIntervalEnabled?: boolean;

  runTime?: number;
  bootTime?: number;

  pm25?: number;
  recordDate?: Date;

  version?: [number, number];
}

const defaultState: ReportState = {
  connected: false,
  shuttingdown: false,
  latest: {},
  history: [],
  historyFully: false,
};

export default reducerWithInitialState(defaultState)
  .case(setConnected, (state, connected) =>
    produce(state, (draft) => {
      if (!connected) {
        draft.shuttingdown = false;
        draft.latest = {};
      }
      draft.connected = connected;
    }),
  )
  .case(updatePacket, (state, packet) =>
    produce(state, (draft) => {
      draft.shuttingdown = false;
      if (packet instanceof BatteryPacket) {
        draft.latest.batteryCapacity = packet.capacity;
        draft.latest.batteryCharging = packet.isCharging;
      } else if (packet instanceof MeasurementSetupPacket) {
        draft.latest.measurementInterval = packet.interval;
        draft.latest.measurementIntervalEnabled = packet.enabled;
      } else if (packet instanceof RuntimePacket) {
        draft.latest.runTime = packet.runtime;
        draft.latest.bootTime = packet.boottime;
      } else if (packet instanceof SensorPacket) {
        draft.latest.pm25 = packet.pm25;
        draft.latest.recordDate = packet.recordDate;
      } else if (packet instanceof VersionPacket) {
        draft.latest.version = [packet.major, packet.minor];
      } else if (packet instanceof ShutdownPacket) {
        draft.shuttingdown = true;
      } else if (packet instanceof HistoryPacket) {
        draft.history.push({
          pm25: packet.pm25,
          recordDate: packet.recordDate,
        });
      } else if (packet instanceof NoMoreHistoryPacket) {
        draft.historyFully = true;
      }
    }),
  );
