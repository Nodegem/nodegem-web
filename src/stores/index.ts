import { observable } from 'mobx';
import { ignore } from 'mobx-sync';

import authStore from './auth-store';
import userStore from './user-store';
import editorStore from 'src/features/Editor/editor-store';
import dashboardStore from 'src/features/Dashboard/dashboard-store';
import commonStore from './common-store';

class RootStore {

    @ignore
    @observable
    isLoaded: boolean = false;

    userStore = userStore;
    commonStore = commonStore;
    authStore = authStore;

    @ignore editorStore = editorStore;
    @ignore dashboardStore = dashboardStore;
}

const rootStore = new RootStore();

export {
    rootStore,
    userStore,
    commonStore,
    authStore,
    dashboardStore,
    editorStore
}