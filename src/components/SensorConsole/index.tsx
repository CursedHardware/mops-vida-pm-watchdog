import prettyDuration from 'pretty-ms';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, ButtonGroup, Container, Progress, Row, Table } from 'reactstrap';
import { connect, disconnect, readHistory, requestDevice, shutdown } from '../../actions/sensor';
import { FormattedPM25 } from './FormattedPM25';
import { History } from './History';
import locals from './index.scss';
import { MeasurementInterval } from './MeasurementInterval';

export const SensorConsole: React.FC = () => {
  const dispatch = useDispatch();
  const connected = useSelector((state) => state.report.connected);
  const shuttingdown = useSelector((state) => state.report.shuttingdown);
  const latest = useSelector((state) => state.report.latest);
  const onConnect = async () => {
    if (connected) {
      await dispatch(disconnect());
    } else {
      await dispatch(requestDevice());
      await dispatch(connect());
    }
  };
  const onShutdown = () => dispatch(shutdown());
  const onReadHistory = () => dispatch(readHistory());
  return (
    <Container className={locals.container}>
      <Row>
        <ButtonGroup>
          <Button color={connected ? 'success' : 'primary'} onClick={onConnect}>
            {connected ? 'Disconnect' : 'Connect'}
          </Button>
          <Button disabled={!connected} color={connected ? 'danger' : undefined} onClick={onShutdown}>
            {shuttingdown ? 'Shutting down' : 'Shutdown'}
          </Button>
          <Button disabled={!connected} color={connected ? 'info' : undefined} onClick={onReadHistory}>
            Read history (one-time)
          </Button>
        </ButtonGroup>
      </Row>
      <Row>
        <h1>Real-time</h1>
        <Table className={locals.table} responsive borderless>
          <thead>
            <tr>
              <th className={locals.field}>#</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                PM <sub>2.5</sub>
              </td>
              <td className='text-monospace'>
                <FormattedPM25 value={latest.pm25} />
              </td>
            </tr>
            <tr>
              <td>Battery</td>
              <td>
                <Progress value={latest.batteryCapacity ?? 0}>
                  {latest.batteryCapacity ? `${latest.batteryCapacity}%` : 'N/A'} {latest.batteryCharging ? '(Charging)' : '(Discharge)'}
                </Progress>
              </td>
            </tr>
            <tr>
              <td>Record date</td>
              <td className='text-monospace'>{latest.recordDate?.toLocaleString() ?? 'N/A'}</td>
            </tr>
            <tr>
              <td>Runtime</td>
              <td className='text-monospace'>{latest.runTime ? prettyDuration(latest.runTime * 1000) : 'N/A'}</td>
            </tr>
            <tr>
              <td>Boot time</td>
              <td className='text-monospace'>{latest.bootTime ? prettyDuration(latest.bootTime * 1000) : 'N/A'}</td>
            </tr>
            <tr>
              <td>Measurement Interval</td>
              <td className='text-monospace'>
                <MeasurementInterval />
              </td>
            </tr>
            <tr>
              <td>Firmare Version</td>
              <td className='text-monospace'>{latest.version ?? 'N/A'}</td>
            </tr>
          </tbody>
        </Table>
      </Row>
      <History />
    </Container>
  );
};
