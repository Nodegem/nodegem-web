import graphModalStore, {
    GraphModalStore,
} from 'components/Modals/GraphModal/graph-modal-store';
import macroModalStore, {
    MacroModalStore,
} from 'components/Modals/MacroModal/macro-modal-store';
import { useLocalStore } from 'mobx-react-lite';
import React from 'react';
import { SandboxStore, UserStore } from 'stores';
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
    sandboxStore: SandboxStore;
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
        sandboxStore: new SandboxStore(),
    };
}

export const legacyStore = createRootStore();

const storeContext = React.createContext<TRootStore | null>(null);

export const StoreProvider = ({ children }) => {
    const store = useLocalStore(() => legacyStore);
    return (
        <storeContext.Provider value={store}>{children}</storeContext.Provider>
    );
};

export const useStore = () => {
    const store = React.useContext(storeContext);
    if (!store) {
        // this is especially useful in TypeScript so you don't need to be checking for null all the time
        throw new Error('You have forgot to use StoreProvider, shame on you.');
    }
    return store;
};
