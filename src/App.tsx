import * as React from 'react';
import { Switch, Route, Router } from 'react-router-dom';
import { Layout } from 'antd';
import Sider from './features/Sider/Sider';
import FlowEditor from './features/FlowEditor/FlowEditor';
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute';
import LoginView from './features/Account/Login/LoginFormView';

import './App.scss';
import history from './utils/history';

const { Content } = Layout;

const FakeDashboard = () => <></>;
const EditorPage = () => <FlowEditor />;

const LoginPage = () => <LoginView />;

class App extends React.PureComponent {

  public render() {

    return (
        <Router history={history}>
            <Layout className="app-layout">
              <Layout>
                <Sider />
                <Content className="app-layout-content" >
                  <Switch>
                    <Route path="/login" component={LoginPage} />
                    <ProtectedRoute exact path="/" component={FakeDashboard} />
                    <ProtectedRoute path="/editor" component={EditorPage} />
                  </Switch>
                </Content>
              </Layout>
            </Layout>
        </Router>
    );
  }
}

export default App;
