import * as React from 'react';
import { Switch, Route, Router } from 'react-router-dom';
import { Layout } from 'antd';
import Sider from './features/Sider/Sider';
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute';
import LoginView from './features/Account/Login/LoginFormView';
import RegisterView from './features/Account/Register/RegisterFormView';
import history from './utils/history';

import './App.less';
import EditorView from './features/Editor/EditorView';
import DashboardView from './features/Dashboard/DashboardView';

const { Content } = Layout;

class App extends React.PureComponent {

  public render() {

    return (
        <Router history={history}>
            <Layout className="app-layout">
              <Layout>
                <Sider />
                <Content className="app-layout-content" >
                  <Switch>
                    <Route path="/login" component={LoginView} />
                    <Route path="/register" component={RegisterView} />
                    <Route path="/forgot-password" component={RegisterView} />
                    <Route path="/editor" component={EditorView} />
                    <ProtectedRoute exact path="/" component={DashboardView} />
                  </Switch>
                </Content>
              </Layout>
            </Layout>
        </Router>
    );
  }
}

export default App;
