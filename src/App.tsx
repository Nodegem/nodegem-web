import * as React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Layout } from 'antd';
import Sider from './features/Sider/Sider';
import FlowEditor from './features/FlowEditor/FlowEditor';
import { LoginView } from './features/Login/Login';
import { PrivateRoute } from './components/ProtectedRoute/PrivateRoute';

import './App.scss';
import Header from './features/Header/Header';

const { Content } = Layout;

const FakeDashboard = () => <></>;
const NewEditorPage = () => <FlowEditor />;

class App extends React.PureComponent {

  public render() {

    return (
        <BrowserRouter>
            <Layout style={{ minHeight: "100vh", height: "auto", margin: 0, padding: 0 }}>
              <Header />
              <Layout>
                <Sider />
                <Content style={{ padding: "20px", display: "flex", flexDirection: "column", minHeight: "100%" }}>
                  <Switch>
                    <Route exact path="/" component={FakeDashboard} />
                    <Route path="/login" component={LoginView} />
                    <PrivateRoute path="/editor" component={NewEditorPage} />
                  </Switch>
                </Content>
              </Layout>
            </Layout>
        </BrowserRouter>
    );
  }
}

export default App;
