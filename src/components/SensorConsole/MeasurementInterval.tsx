import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, ListGroup, ListGroupItem } from 'reactstrap';
import { setMeasurementEnable, setMeasurementInterval } from '../../actions/sensor';

const steps = [1, 5, 10, 15, 30, 60, 90, 120];

export const MeasurementInterval: React.FC = () => {
  const target = React.useRef<HTMLElement>(null);
  const [open, setOpen] = React.useState(false);
  const dispatch = useDispatch();
  const connected = useSelector((state) => state.report.connected);
  const interval = useSelector((state) => state.report.latest.measurementInterval);
  const enabled = useSelector((state) => state.report.latest.measurementIntervalEnabled);
  const onToggle = () => setOpen(connected && !open);
  const onChange = async (value: number) => {
    setOpen(false);
    await dispatch(setMeasurementInterval(value));
    await dispatch(setMeasurementEnable(true));
  };
  const onDisable = async () => {
    setOpen(false);
    dispatch(setMeasurementEnable(false));
  };
  return (
    <>
      <span onClick={onToggle}>{enabled ? `${interval} minutes` : 'Disabled'}</span>
      <Modal placement='bottom' isOpen={open} target={target} toggle={onToggle}>
        <ModalHeader>Measurement interval</ModalHeader>
        <ModalBody>
          <p>Current Interval: {interval} minutes</p>
          <ListGroup>
            {steps.map((step) => (
              <ListGroupItem onClick={() => onChange(step)} key={step} active={step === interval}>
                {step} minutes
              </ListGroupItem>
            ))}
          </ListGroup>
        </ModalBody>
        <ModalFooter>
          <Button color='primary' onClick={onDisable} hidden={!enabled}>
            Disable
          </Button>
          <Button color='secondary' onClick={onToggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};
