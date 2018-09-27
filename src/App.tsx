import * as React from 'react';
import './App.scss';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Layout } from 'antd';
import Sider from './features/Sider/Sider';
import FlowEditor from './features/FlowEditor/FlowEditor';
import { LoginView } from './features/Login/Login';

const { Content } = Layout;

const NewEditorPage = () => <FlowEditor />;

class App extends React.PureComponent {

  public render() {

    return (
        <BrowserRouter>
            <Layout style={{ minHeight: "100vh", height: "auto", margin: 0, padding: 0 }}>
              <Sider />
              <Layout>
                <Content style={{ padding: "20px", display: "flex", flexDirection: "column", minHeight: "100%" }}>
                  <Switch>
                    <Route path="/" component={NewEditorPage} exact />
                    <Route path="/login" component={LoginView} />
                  </Switch>
                </Content>
              </Layout>
            </Layout>
        </BrowserRouter>
    );
  }
}

export default App;
