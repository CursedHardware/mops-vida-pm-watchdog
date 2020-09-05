import 'bootstrap/dist/css/bootstrap.min.css';

import ready from 'domready';
import React from 'react';
import ReactDOM from 'react-dom';
import { Entry } from './Entry';

ready(() => {
  const container = document.createElement('main');
  document.body = document.createElement('body');
  document.body.appendChild(container);
  ReactDOM.render(React.createElement(Entry), container);
});
