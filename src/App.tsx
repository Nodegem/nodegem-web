import './App.less';

import { Layout } from 'antd';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { Route, RouteComponentProps, Switch, withRouter } from 'react-router';

import { AnonymousOnlyRoute, PublicRoute } from 'components';
import { Header } from 'components/Header/Header';
import { GraphForm } from 'components/Modals/GraphModal/GraphForm';
import { RegisterExternal } from 'features/Account/RegisterExternal/RegisterExternal';
import { SandboxView } from 'features/Sandbox/SandboxView';
import moment from 'moment';
import { useStore } from 'overstated';
import { appStore } from 'stores';
import { AuthorizedRoute } from './components/AuthorizedRoute/AuthorizedRoute';
import LoginView from './features/Account/Login/LoginFormView';
import RegisterView from './features/Account/Register/RegisterFormView';
import DashboardView from './features/Dashboard/DashboardView';
import NotFoundView from './features/NotFound/NotFound';
import ProfileView from './features/Profile/ProfileView';
import { UserStore } from './stores/user-store';

const { Content } = Layout;
const ForgotPassword = () => <div>Welp, that sucks duude</div>;

interface IAppProps {
    userStore?: UserStore;
}

const Test = () => (
    <GraphForm
        graph={
            {
                name: 'test',
                createdOn: moment()
                    .add(-1, 'days')
                    .toDate(),
            } as any
        }
    />
);

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
                    <AuthorizedRoute path="/profile" component={ProfileView} />
                    <AuthorizedRoute
                        path="/graph-form"
                        // component={
                        //     <div>
                        //         <GraphForm name="test" />
                        //     </div>
                        // }
                        component={Test}
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
