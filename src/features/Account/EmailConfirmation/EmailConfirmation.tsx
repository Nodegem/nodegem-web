import qs from 'query-string';
import React, { useEffect } from 'react';
import { useLocation } from 'react-router';
import { AuthService } from 'services';
import { appStore } from 'stores';
import routerHistory from 'utils/history';

export const EmailConfirmationView = () => {
    const location = useLocation();

    useEffect(() => {
        const queryValues = qs.parse(location.search, {
            parseBooleans: true,
            parseNumbers: true,
        });

        AuthService.emailConfirmation(
            queryValues.userId as string,
            queryValues.token as string
        )
            .then(response => {
                appStore.openNotification({
                    title: 'Email cofirmation successful!',
                    description: '',
                    type: 'success',
                });
            })
            .catch(err => {
                console.error(err);
                appStore.openNotification({
                    title: 'Unable to confirm email',
                    description: 'Invalid token',
                    type: 'error',
                });
                appStore.userStore.logout();
            })
            .finally(() => {
                routerHistory.push('/');
            });
    }, []);

    return <></>;
};
