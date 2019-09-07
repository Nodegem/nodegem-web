import graphModalStore, {
    GraphModalStore,
} from 'components/Modals/GraphModal/graph-modal-store';
import macroModalStore, {
    MacroModalStore,
} from 'components/Modals/MacroModal/macro-modal-store';
import SandboxManager from 'features/Sandbox/Sandbox/sandbox-manager';
import { useLocalStore } from 'mobx-react-lite';
import React from 'react';
import {
    createAuthStore,
    createCommonStore,
    createUserStore,
    SandboxStore,
    TAuthStore,
    TCommonStore,
    TUserStore,
} from 'stores';

type TRootStore = {
    commonStore: TCommonStore;
    authStore: TAuthStore;
    userStore: TUserStore;
    graphStore: GraphModalStore;
    macroStore: MacroModalStore;
    sandboxStore: SandboxStore;
};

function createRootStore(): TRootStore {
    return {
        commonStore: createCommonStore(),
        authStore: createAuthStore(),
        userStore: createUserStore(),
        macroStore: macroModalStore,
        graphStore: graphModalStore,
        sandboxStore: new SandboxStore(),
    };
}

const storeContext = React.createContext<TRootStore | null>(null);

export const StoreProvider = ({ children }) => {
    const store = useLocalStore(createRootStore);
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
