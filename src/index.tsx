import './index.less';
import './utils/extensions';

import { Provider } from 'mobx-react';
import { debug, Provider as OverstatedProvider } from 'overstated';
import * as React from 'react';
import { Router } from 'react-router';

import localforage from 'localforage';
import App from './App';
import * as servicerWorker from './serviceWorker';
import routerHistory from './utils/history';

import ReactDOM from 'react-dom';
import { legacyStore } from './stores';

if (process.env.NODE_ENV && process.env.NODE_ENV === 'development') {
    debug();
}

localforage.config({
    name: 'nodegem',
    driver: localforage.INDEXEDDB,
    version: 1.0,
    storeName: 'nodegem',
});

ReactDOM.render(
    <Provider {...legacyStore}>
        <OverstatedProvider>
            <Router history={routerHistory}>
                <App />
            </Router>
        </OverstatedProvider>
    </Provider>,
    document.getElementById('root') as HTMLElement
);

servicerWorker.unregister();
