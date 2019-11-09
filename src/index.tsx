import './index.less';
import './utils/extensions';

import { Provider as OverstatedProvider } from 'overstated';
import * as React from 'react';
import { Router } from 'react-router';

import localforage from 'localforage';
import App from './App';
import * as servicerWorker from './serviceWorker';
import routerHistory from './utils/history';

import { LoadedStateGate } from 'components/LoadedStateGate/LoadedStateGate';
import ReactDOM from 'react-dom';

localforage.config({
    name: 'nodegem',
    driver: localforage.INDEXEDDB,
    version: 1.0,
    storeName: 'nodegem',
});

ReactDOM.render(
    <OverstatedProvider>
        <LoadedStateGate>
            <Router history={routerHistory}>
                {/* <React.StrictMode> */}
                <App />
                {/* </React.StrictMode> */}
            </Router>
        </LoadedStateGate>
    </OverstatedProvider>,
    document.getElementById('root') as HTMLElement
);

servicerWorker.unregister();
