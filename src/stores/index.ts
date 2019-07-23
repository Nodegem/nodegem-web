import graphModalStore from 'components/Modals/GraphModal/graph-modal-store';
import macroModalStore from 'components/Modals/MacroModal/macro-modal-store';
import editorStore from 'features/Editor/editor-store';
import { action } from 'mobx';

import authStore from './auth-store';
import commonStore from './common-store';
import graphStore from './graph-store';
import macroStore from './macro-store';
import userStore from './user-store';

class RootStore implements IDisposableStore {
    @action public dispose() {
        graphStore.dispose();
        macroStore.dispose();
        userStore.dispose();
        editorStore.dispose();
    }
}

const rootStore = new RootStore();

export {
    rootStore,
    userStore,
    commonStore,
    authStore,
    editorStore,
    graphStore,
    macroStore,
    graphModalStore,
    macroModalStore,
};
