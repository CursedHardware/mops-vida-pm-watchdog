import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { requestDevice } from '../actions/sensor';
import { SensorService } from '../service';

export type SensorState = SensorService | null;

// prettier-ignore
export default reducerWithInitialState<SensorState>(null)
  .case(requestDevice.async.done, (state, payload) => payload.result);
