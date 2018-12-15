import './App.less';

import { Layout } from 'antd';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { Route, RouteComponentProps, Switch, withRouter } from 'react-router-dom';

import LoginView from './features/Account/Login/LoginFormView';
import RegisterView from './features/Account/Register/RegisterFormView';
import DashboardView from './features/Dashboard/DashboardView';
import EditorView from './features/Editor/EditorView';
import ProfileView from './features/Profile/ProfileView';
import Sider from './features/Sider/Sider';
import { UserStore } from './stores/user-store';

const { Content } = Layout;

const ForgotPassword = <div>Welp, that sucks duude</div>

interface IAppProps {
    userStore?: UserStore;
}

@inject("userStore")
@observer
class App extends React.Component<IAppProps & RouteComponentProps<any>> {
    public render() {
        const { userStore } = this.props;

        return (
            <Layout className="app-layout">
                {userStore!.isLoggedIn ? (
                    <Layout hasSider>
                        <Sider />
                        <Content className="app-layout-content">
                            <Switch>
                                <Route
                                    path="/"
                                    component={DashboardView}
                                    exact
                                />
                                <Route path="/editor" component={EditorView} />
                                <Route path="/profile" component={ProfileView} />
                            </Switch>
                        </Content>
                    </Layout>
                ) : (
                    <Content className="app-layout-content">
                        <Switch>
                            <Route exact path="/" component={LoginView} />
                            <Route path="/login" component={LoginView} />
                            <Route path="/register" component={RegisterView} />
                            <Route path="/forgot-password" component={ForgotPassword} />
                        </Switch>
                    </Content>
                )}
            </Layout>
        );
    }
}

export default withRouter(App);
