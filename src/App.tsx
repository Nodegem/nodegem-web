import './App.less';

import { Layout } from 'antd';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { Route, RouteComponentProps, Switch, withRouter } from 'react-router';

import { Header } from 'components/Header/Header';
import { SandboxView } from 'features/Sandbox/SandboxView';
import { GlobalContainer } from 'global-container';
import { AuthorizedRoute } from './components/AuthorizedRoute/AuthorizedRoute';
import { PublicRoute } from './components/PublicRoute/AuthorizedRoute';
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

@inject('userStore')
@observer
class App extends React.Component<IAppProps & RouteComponentProps<any>> {
    public render() {
        const { userStore } = this.props;

        return (
            <Layout className="app-layout">
                {userStore!.isLoggedIn && <Header />}
                <Content className="app-layout-content">
                    <GlobalContainer.Provider>
                        <Switch>
                            <AuthorizedRoute
                                exact
                                path="/"
                                component={DashboardView}
                            />
                            <AuthorizedRoute
                                path="/sandbox"
                                component={SandboxView}
                            />
                            <AuthorizedRoute
                                path="/profile"
                                component={ProfileView}
                            />
                            <PublicRoute path="/login" component={LoginView} />
                            <PublicRoute
                                path="/register"
                                component={RegisterView}
                            />
                            <PublicRoute
                                path="/forgot-password"
                                component={ForgotPassword}
                            />
                            <Route component={NotFoundView} />
                        </Switch>
                    </GlobalContainer.Provider>
                </Content>
            </Layout>
        );
    }
}

export default withRouter(App);
