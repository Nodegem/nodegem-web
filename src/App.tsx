import './App.less';

import { Layout } from 'antd';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { RouteComponentProps, Switch, withRouter } from 'react-router';

import { Header } from 'components/Header/Header';
import { SandboxView } from 'features/Sandbox/SandboxView';
import { TestingGroundView } from 'features/TestingGround/TestingGroundView';
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

        const minHeight = userStore!.isLoggedIn
            ? 'calc(100vh - 52px)'
            : '100vh';

        return (
            <Layout className="app-layout">
                {userStore!.isLoggedIn && <Header />}
                <Content className="app-layout-content" style={{ minHeight }}>
                    <Switch>
                        <AuthorizedRoute
                            exact
                            path="/"
                            component={DashboardView}
                        />
                        <AuthorizedRoute
                            path="/testingGround"
                            component={TestingGroundView}
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
                        <AuthorizedRoute component={NotFoundView} />
                        <PublicRoute component={NotFoundView} />
                    </Switch>
                </Content>
            </Layout>
        );
    }
}

export default withRouter(App);
