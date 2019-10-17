import './index.less';
import './utils/extensions';

import { Provider } from 'mobx-react';
import { debug, Provider as OverstatedProvider } from 'overstated';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router } from 'react-router';

import App from './App';
import * as servicerWorker from './serviceWorker';
import history from './utils/history';

import { legacyStore } from './stores';

debug();

ReactDOM.render(
    <Provider {...legacyStore}>
        <OverstatedProvider>
            <Router history={history}>
                <App />
            </Router>
        </OverstatedProvider>
    </Provider>,
    document.getElementById('root') as HTMLElement
);

servicerWorker.unregister();
