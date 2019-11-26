import qs from 'qs';
import React, { useEffect } from 'react';
import { useLocation } from 'react-router';

export const RegisterExternal: React.FC = () => {
    const location = useLocation();

    useEffect(() => {
        const queryValues = qs.parse(location.search.replace('?', ''));

        if (window.opener) {
            const data = {
                result: {
                    socialLogin: true,
                    token: queryValues.token,
                    success: queryValues.success,
                    message: queryValues.message,
                },
            };
            window.opener.postMessage(data, '*');
            window.close();
        }
    }, []);

    return <></>;
};
