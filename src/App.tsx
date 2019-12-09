import './App.less';

import { Layout } from 'antd';
import * as React from 'react';
import { Route, Switch, withRouter } from 'react-router';

import { AnonymousOnlyRoute, PublicRoute } from 'components';
import { Header } from 'components/Header/Header';
import { EmailConfirmationView } from 'features/Account/EmailConfirmation/EmailConfirmation';
import { RegisterExternal } from 'features/Account/RegisterExternal/RegisterExternal';
import { SandboxView } from 'features/Sandbox/SandboxView';
import { useStore } from 'overstated';
import { appStore } from 'stores';
import { AuthorizedRoute } from './components/AuthorizedRoute/AuthorizedRoute';
import LoginView from './features/Account/Login/LoginFormView';
import RegisterView from './features/Account/Register/RegisterFormView';
import DashboardView from './features/Dashboard/DashboardView';
import NotFoundView from './features/NotFound/NotFound';
import { SettingsView } from 'features/Settings/SettingsView';

const { Content } = Layout;
const ForgotPassword = () => <div>Welp, that sucks duude</div>;

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
