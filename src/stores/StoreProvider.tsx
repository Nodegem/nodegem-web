import graphModalStore, {
    GraphModalStore,
} from 'components/Modals/GraphModal/graph-modal-store';
import macroModalStore, {
    MacroModalStore,
} from 'components/Modals/MacroModal/macro-modal-store';
import { UserStore } from 'stores';
import authStore, { AuthStore } from './auth-store';
import commonStore, { CommonStore } from './common-store';
import graphStore, { GraphStore } from './graph-store';
import macroStore, { MacroStore } from './macro-store';
import userStore from './user-store';

type TRootStore = {
    commonStore: CommonStore;
    authStore: AuthStore;
    userStore: UserStore;
    graphModalStore: GraphModalStore;
    macroModalStore: MacroModalStore;
    macroStore: MacroStore;
    graphStore: GraphStore;
};

function createRootStore(): TRootStore {
    return {
        commonStore,
        authStore,
        userStore,
        macroModalStore,
        graphModalStore,
        macroStore,
        graphStore,
    };
}

export const legacyStore = createRootStore();
