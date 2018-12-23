import { observable } from 'mobx';
import { ignore } from 'mobx-sync';
import dashboardStore from 'src/features/Dashboard/dashboard-store';
import editorStore from 'src/features/Editor/editor-store';

import authStore from './auth-store';
import commonStore from './common-store';
import userStore from './user-store';

const rootStoreKey = "root";

class RootStore {
    @ignore
    @observable
    isLoaded: boolean = false;

    userStore = userStore;
    commonStore = commonStore;
    authStore = authStore;

    editorStore = editorStore;
    dashboardStore = dashboardStore;
}

const rootStore = new RootStore();

export {
    rootStoreKey,
    rootStore,
    userStore,
    commonStore,
    authStore,
    dashboardStore,
    editorStore,
};
