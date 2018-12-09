import * as React from 'react';
import { Route, Redirect } from 'react-router';

export const ProtectedRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => (
        true
            ? <Component {...props} />
            : <Redirect to={{
                pathname: '/login',
                state: { from: props.location }
            }} />
    )} />
);