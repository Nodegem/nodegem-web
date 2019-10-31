import qs from 'query-string';
import React, { useEffect } from 'react';
import { useLocation } from 'react-router';
import { appStore } from 'stores/app-store';
import routerHistory from 'utils/history';

export const RegisterExternal: React.FC = () => {
    const location = useLocation();

    useEffect(() => {
        const queryValues = qs.parse(location.search, {
            parseBooleans: true,
            parseNumbers: true,
        });
        if (!!queryValues.token && queryValues.success) {
            // Make a login request
            appStore.userStore.loginWithToken(queryValues.token as string);
        } else {
            appStore.openNotification({
                title: 'Unable to sign-in',
                description: queryValues.message as string,
                type: 'error',
            });
            routerHistory.push('/login');
        }
    }, []);

    return <></>;
};