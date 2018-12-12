import { observable } from 'mobx';
import { ignore } from 'mobx-sync';

import authStore from './auth-store';
import commonStore from './common-store';
import dashboardStore from './dashboard-store';
import editorStore from './editor-store';
import userStore from './user-store';

class PersistStore  {

    @ignore
    @observable
    isLoaded: boolean = false;

    userStore = userStore;
    commonStore = commonStore;

}

class RootStore {

    @ignore
    @observable
    isLoaded: boolean = false;

    userStore = userStore;
    commonStore = commonStore;
    authStore = authStore;
    editorStore = editorStore;
    dashboardStore = dashboardStore;

    constructor() {
        
    }

}

const persistStore = new PersistStore();

export {
    persistStore,
    userStore,
    commonStore,
    authStore,
    dashboardStore,
    editorStore
}