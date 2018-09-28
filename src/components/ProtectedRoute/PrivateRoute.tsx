import * as React from 'react';
import { Route, Redirect } from 'react-router';
import { userStore } from '../../stores/user-store';

export const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => (
        userStore.isAuthenticated
            ? <Component {...props} />
            : <Redirect to={{
                pathname: '/login',
                state: { from: props.location }
            }} />
    )} />
);