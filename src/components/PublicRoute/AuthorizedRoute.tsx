import * as React from 'react';
import { Redirect, Route } from 'react-router';
import userStore, { UserStore } from 'src/stores/user-store';

export const PublicRoute = ({
    component: Component,
    condition = () => userStore!.isLoggedIn,
    redirectPath = '/',
    ...rest
}) => (
    <Route
        {...rest}
        render={props =>
            !condition() ? (
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
