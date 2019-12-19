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

declare let gtag: Function;

routerHistory.listen(location => {
    if (gtag) {
        gtag('config', 'UA-149911422-1', {
            // eslint-disable-next-line @typescript-eslint/camelcase
            page_path: location.pathname,
        });
    }
});

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
