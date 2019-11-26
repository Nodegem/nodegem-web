import * as React from 'react';
import { Redirect, Route } from 'react-router';
import { appStore } from 'stores';

export const AuthorizedRoute = ({
    component: Component,
    condition = () => appStore.userStore.state.isLoggedIn,
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
