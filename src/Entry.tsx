import React from 'react';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router';
import { ConnectedRouter } from 'connected-react-router';

import { configureStore, history } from './configureStore';
import { SensorConsole } from './components/SensorConsole';

const store = configureStore();

export const Entry: React.FC = () => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Switch>
        <Route exact path='/' component={SensorConsole} />
      </Switch>
    </ConnectedRouter>
  </Provider>
);
