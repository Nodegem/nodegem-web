import './index.less';
import './utils/extensions';

import LocalForage from 'localforage';
import { Provider } from 'mobx-react';
import DevTools from 'mobx-react-devtools';
import { AsyncTrunk } from 'mobx-sync';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router } from 'react-router';

import App from './App';
import registerServiceWorker from './registerServiceWorker';
import {
    authStore, commonStore, dashboardStore, editorStore, persistStore, userStore
} from './stores';
import history from './utils/history';

const stores = {
    authStore,
    dashboardStore,
    commonStore,
    userStore,
    editorStore
};

const trunk = new AsyncTrunk(persistStore, {
    storage: LocalForage as any
});

trunk.init().then(() => {
    persistStore.isLoaded = true;
});

ReactDOM.render(
    <>
        <Provider {...stores}>
            <Router history={history}>
                <App />
            </Router>
        </Provider>
        <DevTools />
    </>,
    document.getElementById("root") as HTMLElement
);
registerServiceWorker();
