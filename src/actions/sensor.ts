import actionCreatorFactory from 'typescript-fsa';
import { asyncFactory } from 'typescript-fsa-redux-thunk';

import { SensorService, PacketType } from '../service';
import * as Commands from '../service/commands';

const create = actionCreatorFactory('SENSOR');
const createAsync = asyncFactory(create);

export const setConnected = create<boolean>('SET_CONNECTED');
export const updatePacket = create<PacketType>('UPDATE_PACKET');

export const requestDevice = createAsync('REQUEST_DEVICE', async () => {
  return SensorService.requestDevice();
});

export const connect = createAsync('CONNECT', async (params, dispatch, getState) => {
  const { sensor } = getState();
  if (sensor === null) {
    return;
  }
  await sensor.connect();
  dispatch(setConnected(true));
  sensor.on('disconnected', () => dispatch(setConnected(false)));
  sensor.on('packet', (packet) => dispatch(updatePacket(packet)));
  sensor.on('failed', (packet) => {
    console.log('Block', packet.toString('hex').toUpperCase());
  });
  await sensor.sendCommand(Commands.setTime());
});

export const disconnect = createAsync('DISCONNECT', async (params, dispatch, getState) => {
  const { sensor } = getState();
  return sensor?.disconnect();
});

const sendMessage = createAsync('SEND_MESSAGE', async (payload: Buffer, dispatch, getState) => {
  const { sensor } = getState();
  return sensor?.sendCommand(payload);
});

export const setMeasurementEnable = (enabled: boolean) => sendMessage(Commands.setMeasurementEnable(enabled));

export const setMeasurementInterval = (value: number) => sendMessage(Commands.setMeasurementInterval(value));

export const shutdown = () => sendMessage(Commands.shutdown());
