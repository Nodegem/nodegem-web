import * as React from 'react';
import { Redirect, Route } from 'react-router';
import userStore from 'stores/user-store';

export const AuthorizedRoute = ({
    component: Component,
    condition = () => userStore!.isLoggedIn,
    redirectPath = '/login',
    ...rest
}) => (
    <Route
        {...rest}
        render={props =>
            condition() ? (
                <Component {...props} />
            ) : (
                <Redirect
                    to={{
                        pathname: redirectPath,
                        state: { from: props.location },
                    }}
                />
            )
        }
    />
);
