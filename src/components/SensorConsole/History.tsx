import React from 'react';
import { Row, Table, Button } from 'reactstrap';
import { useSelector } from 'react-redux';

export const History = () => {
  const history = useSelector((state) => state.report.history);
  const onDownload = () => {
    const encoded = JSON.stringify(history, null, 2);
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([encoded], { type: 'application/json' }));
    link.download = makeDownloadFile();
    link.click();
  };
  return (
    <Row hidden={history.length === 0}>
      <h1>
        History{' '}
        <Button size='sm' color='link' onClick={onDownload}>
          Download
        </Button>
      </h1>
      <Table responsive borderless size='sm'>
        <thead>
          <tr>
            <th>#</th>
            <th>
              PM <sub>2.5</sub>
            </th>
          </tr>
        </thead>
        <tbody>
          {history.map(({ recordDate, pm25 }, index) => (
            <tr key={index}>
              <td>{recordDate?.toLocaleString()}</td>
              <td>{pm25}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Row>
  );
};

function makeDownloadFile() {
  const now = new Date();
  const fields = [now.getFullYear(), now.getMonth() + 1, now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds()];
  const timestamp = fields.map((value) => value.toString().padStart(2, '0')).join('');
  return `history-${timestamp}.json`;
}
