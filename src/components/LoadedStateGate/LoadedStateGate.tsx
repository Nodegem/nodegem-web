import React, { useEffect, useState } from 'react';
import { appStore } from 'stores';

export const LoadedStateGate: React.FC = ({ children }) => {
    const [hasLoadedState, setHasLoadedState] = useState(false);

    useEffect(() => {
        appStore
            .loadStateFromStorage()
            .then(() => {
                setHasLoadedState(true);
            })
            .catch(err => {
                console.error(err);
            });
    });

    return hasLoadedState ? <>{children}</> : <></>;
};
