import qs from 'query-string';
import React, { useEffect } from 'react';
import { useLocation } from 'react-router';
import { authStore } from 'stores';
import { appStore } from 'stores/app-store';
import routerHistory from 'utils/history';

export const RegisterExternal: React.FC = () => {
    const location = useLocation();

    useEffect(() => {
        const queryValues = qs.parse(location.search);
        if (!!queryValues.token) {
            // Make a login request
            authStore.loginWithToken(queryValues.token as string);
            appStore.openNotification({
                title: 'Welcome!',
                description: queryValues.message as string,
                type: 'success',
            });
        } else {
            routerHistory.push('/login');
            appStore.openNotification({
                title: 'Unable to sign-in',
                description: queryValues.message as string,
                type: 'error',
            });
        }
    }, []);

    return <></>;
};
