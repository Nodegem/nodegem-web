import * as React from 'react';
import { Route } from 'react-router';
import { appStore } from 'stores';

export const PublicRoute = ({
    component: Component,
    condition = () => !appStore.userStore.state.isLoggedIn,
    redirectPath = '/',
    ...rest
}) => <Route {...rest} render={props => <Component {...props} />} />;
