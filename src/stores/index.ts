import { observable, action } from 'mobx';
import { ignore } from 'mobx-sync';
import dashboardStore from 'src/features/Dashboard/dashboard-store';
import editorStore from 'src/features/Editor/editor-store';

import authStore from './auth-store';
import commonStore from './common-store';
import userStore from './user-store';
import graphStore from './graph-store';
import macroStore from './macro-store';

const rootStoreKey = "root";

interface IDisposableStore {
    dispose: () => void;
}

class RootStore implements IDisposableStore {
    @ignore
    @observable
    isLoaded: boolean = false;

    userStore = userStore;
    commonStore = commonStore;
    authStore = authStore;
    editorStore = editorStore;
    dashboardStore = dashboardStore;
    graphStore = graphStore;
    macroStore = macroStore;

    @action dispose() {
        graphStore.dispose();
        macroStore.dispose();
        userStore.dispose();
        editorStore.dispose();
    }
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
    graphStore,
    macroStore,
    IDisposableStore
};
