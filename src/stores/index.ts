import { action, observable } from 'mobx';
import { ignore } from 'mobx-sync';
import graphModalStore from 'src/components/Modals/GraphModal/graph-modal-store';
import macroModalStore from 'src/components/Modals/MacroModal/macro-modal-store';
import editorStore from 'src/features/Editor/editor-store';

import authStore from './auth-store';
import commonStore from './common-store';
import graphStore from './graph-store';
import macroStore from './macro-store';
import userStore from './user-store';

const rootStoreKey = 'root';

interface IDisposableStore {
    dispose: () => void;
}

class RootStore implements IDisposableStore {
    @ignore
    @observable
    public isLoaded: boolean = false;

    public userStore = userStore;
    public commonStore = commonStore;
    public authStore = authStore;
    public editorStore = editorStore;
    public graphStore = graphStore;
    public macroStore = macroStore;

    @ignore
    public macroModalStore = macroModalStore;

    @ignore
    public graphModalStore = graphModalStore;

    @action public dispose() {
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
    graphModalStore,
    macroModalStore,
    IDisposableStore,
};
