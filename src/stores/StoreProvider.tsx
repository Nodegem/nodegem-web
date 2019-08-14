import { useLocalStore } from 'mobx-react-lite';
import React from 'react';
import {
    createAuthStore,
    createCommonStore,
    createSandboxCanvasStore,
    createSandboxStore,
    createUserStore,
    TAuthStore,
    TCommonStore,
    TSandboxCanvasStore,
    TSandboxStore,
    TUserStore,
} from 'stores';

type TRootStore = {
    commonStore: TCommonStore;
    authStore: TAuthStore;
    userStore: TUserStore;
    sandboxStore: TSandboxStore;
    sandboxCanvasStore: TSandboxCanvasStore;
};

function createRootStore(): TRootStore {
    return {
        commonStore: createCommonStore(),
        authStore: createAuthStore(),
        userStore: createUserStore(),
        sandboxStore: createSandboxStore(),
        sandboxCanvasStore: createSandboxCanvasStore(),
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
