import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import './index.less';
import registerServiceWorker from './registerServiceWorker';

import './utils/extensions';
import { AsyncTrunk } from 'mobx-sync';
import { rootStore } from './stores/root-store';
import MobXPersistGate from './components/MobXPersistGate/MobXPersistGate';
import { userStore } from './stores/user-store';

const trunk = new AsyncTrunk(rootStore, {
  storage: localStorage,
  storageKey: "root"
});

trunk.init().then(() => {
  rootStore.isLoaded = true;
});

if(userStore.isAuthenticated) {
  userStore.setRefreshTokenInterval();
}

ReactDOM.render(
  (
    <MobXPersistGate rootStore={rootStore} loading={<>Loading...</>}>
      <App />
    </MobXPersistGate>
  ),
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();

