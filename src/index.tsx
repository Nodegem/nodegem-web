import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import './index.scss';
import registerServiceWorker from './registerServiceWorker';

import './utils/extensions';
import { AsyncTrunk } from 'mobx-sync';
import { rootStore } from './stores/root-store';
import MobXPersistGate from './components/MobXPersistGate/MobXPersistGate';

const trunk = new AsyncTrunk(rootStore, {
  storage: localStorage,
  storageKey: "root"
});

trunk.init().then(() => {
  rootStore.isLoaded = true;
});

ReactDOM.render(
  (
    <MobXPersistGate rootStore={rootStore} loading={<>Loading...</>}>
      <App />
    </MobXPersistGate>
  ),
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();

