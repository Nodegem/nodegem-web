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
import MobXPersistGate from './components/MobXPersistGate/MobXPersistGate';
import registerServiceWorker from './registerServiceWorker';
import { rootStore } from './stores';
import history from './utils/history';

const trunk = new AsyncTrunk(rootStore, {
    storage: LocalForage as any
});

trunk.init().then(() => {
    rootStore.isLoaded = true;
});

const LoadingIcon = <></>;

ReactDOM.render(
    <>
        <MobXPersistGate rootStore={rootStore} loading={LoadingIcon}>
            <Provider {...rootStore}>
                <Router history={history}>
                    <App />
                </Router>
            </Provider>
        </MobXPersistGate>
    </>,
    document.getElementById("root") as HTMLElement
);
registerServiceWorker();
