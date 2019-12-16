import * as React from 'react';
import { Redirect, Route } from 'react-router';
import { appStore } from 'stores';

export const PublicRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => <Component {...props} />} />
);

export const AnonymousOnlyRoute = ({
    component: Component,
    condition = () => !appStore.userStore.state.isLoggedIn,
    redirectPath = '/',
    ...rest
}) =>
    condition() ? (
        <Route {...rest} render={props => <Component {...props} />} />
    ) : (
        <Redirect to={redirectPath} />
    );
