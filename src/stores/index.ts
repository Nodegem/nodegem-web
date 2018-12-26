import { observable, action } from 'mobx';
import { ignore } from 'mobx-sync';
import editorStore from 'src/features/Editor/editor-store';

import authStore from './auth-store';
import commonStore from './common-store';
import userStore from './user-store';
import graphStore from './graph-store';
import macroStore from './macro-store';
<<<<<<< HEAD
import macroModalStore from 'src/components/Modals/MacroModal/macro-modal-store';
import graphModalStore from 'src/components/Modals/GraphModal/graph-modal-store';
=======
>>>>>>> ad647b46713bf57b870ff9d067c4a7324f21ed3d

const rootStoreKey = 'root';

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
<<<<<<< HEAD
    graphStore = graphStore;
    macroStore = macroStore;
    macroModalStore = macroModalStore;
    graphModalStore = graphModalStore;
=======
    dashboardStore = dashboardStore;
    graphStore = graphStore;
    macroStore = macroStore;
>>>>>>> ad647b46713bf57b870ff9d067c4a7324f21ed3d

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
    editorStore,
    graphStore,
    macroStore,
<<<<<<< HEAD
    graphModalStore,
    macroModalStore,
    IDisposableStore,
=======
    IDisposableStore
>>>>>>> ad647b46713bf57b870ff9d067c4a7324f21ed3d
};
