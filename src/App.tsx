import * as React from "react";
import { Switch, Route, withRouter, RouteComponentProps } from "react-router-dom";
import { Layout } from "antd";
import Sider from "./features/Sider/Sider";
import LoginView from "./features/Account/Login/LoginFormView";
import RegisterView from "./features/Account/Register/RegisterFormView";

import "./App.less";
import EditorView from "./features/Editor/EditorView";
import DashboardView from "./features/Dashboard/DashboardView";
import { inject, observer } from "mobx-react";
import { UserStore } from "./stores/user-store";

const { Content } = Layout;

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
                            </Switch>
                        </Content>
                    </Layout>
                ) : (
                    <Content className="app-layout-content">
                        <Switch>
                            <Route exact path="/" component={LoginView} />
                            <Route path="/login" component={LoginView} />
                            <Route path="/register" component={RegisterView} />
                        </Switch>
                    </Content>
                )}
            </Layout>
        );
    }
}

export default withRouter(App);
