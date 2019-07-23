import { useLocalStore } from 'mobx-react-lite';
import React from 'react';
import { createStore, TStore } from './create-store';

const storeContext = React.createContext<TStore | null>(null);

export const StoreProvider = ({ children }) => {
    const store = useLocalStore(createStore);
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
