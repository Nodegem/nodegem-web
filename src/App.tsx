import './App.less';

import { Layout } from 'antd';
import * as React from 'react';
import { Route, Switch, withRouter } from 'react-router';

import { AnonymousOnlyRoute, PublicRoute } from 'components';
import { Header } from 'components/Header/Header';
import { EmailConfirmationView } from 'pages/Account/EmailConfirmation/EmailConfirmation';
import { RegisterExternal } from 'pages/Account/RegisterExternal/RegisterExternal';
import { SandboxView } from 'pages/Sandbox/SandboxView';
import { useStore } from 'overstated';
import { appStore } from 'stores';
import { AuthorizedRoute } from './components/AuthorizedRoute/AuthorizedRoute';
import LoginView from './pages/Account/Login/LoginFormView';
import RegisterView from './pages/Account/Register/Register';
import DashboardView from './pages/Dashboard/DashboardView';
import NotFoundView from './pages/NotFound/NotFound';
import { SettingsView } from 'pages/Settings/SettingsView';
import { ForgotPassword } from 'pages/Account/ForgotPassword/ForgotPassword';
import { ResetPassword } from 'pages/Account/ResetPassword/ResetPassword';

const { Content } = Layout;

const App = () => {
    const { isLoggedIn } = useStore(appStore, store => ({
        isLoggedIn: store.userStore.state.isLoggedIn,
    }));

    return (
        <Layout className="app-layout">
            {isLoggedIn && <Header />}
            <Content className="app-layout-content">
                <Switch>
                    <AuthorizedRoute exact path="/" component={DashboardView} />
                    <AuthorizedRoute path="/sandbox" component={SandboxView} />
                    <AuthorizedRoute
                        path="/settings"
                        component={SettingsView}
                    />
                    <AnonymousOnlyRoute path="/login" component={LoginView} />
                    <AnonymousOnlyRoute
                        path="/forgot-password"
                        component={ForgotPassword}
                    />
                    <PublicRoute
                        path="/register/external"
                        component={RegisterExternal}
                    />
                    <PublicRoute
                        path="/email-confirmation"
                        component={EmailConfirmationView}
                    />
                    <PublicRoute
                        path="/reset-password/:userId/:resetToken"
                        component={ResetPassword}
                    />
                    <AnonymousOnlyRoute
                        path="/register"
                        component={RegisterView}
                    />
                    <Route component={NotFoundView} />
                </Switch>
            </Content>
        </Layout>
    );
};

export default withRouter(App);
