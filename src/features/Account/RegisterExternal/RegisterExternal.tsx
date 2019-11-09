import qs from 'query-string';
import React, { useEffect } from 'react';
import { useLocation } from 'react-router';

export const RegisterExternal: React.FC = () => {
    const location = useLocation();

    useEffect(() => {
        const queryValues = qs.parse(location.search, {
            parseBooleans: true,
            parseNumbers: true,
        });

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
