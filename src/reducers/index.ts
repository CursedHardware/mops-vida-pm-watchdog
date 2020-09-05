import { combineReducers } from 'redux';
import { History } from 'history';
import { connectRouter, RouterState } from 'connected-react-router';

import sensor, { SensorState } from './sensor';
import report, { ReportState } from './report';

export interface RootState {
  router: RouterState<History.PoorMansUnknown>;
  sensor: SensorState;
  report: ReportState;
}

export const createRootReducer = (history: History) =>
  combineReducers({
    router: connectRouter(history),
    sensor,
    report,
  });
