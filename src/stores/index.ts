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

    @observable
    public userStore = userStore;

    @observable
    public commonStore = commonStore;

    @observable
    public authStore = authStore;

    @ignore
    @observable
    public editorStore = editorStore;

    @ignore
    @observable
    public graphStore = graphStore;

    @ignore
    @observable
    public macroStore = macroStore;

    @ignore
    @observable
    public macroModalStore = macroModalStore;

    @ignore
    @observable
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
