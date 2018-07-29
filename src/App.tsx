import * as React from 'react';
import './App.scss';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Editor from 'src/features/Editor/Editor';
import ResubPersistGate from './components/ResubPersistGate/ResubPersistGate';
import { Layout } from 'antd';
import Sider from 'src/features/Sider/Sider';

const { Content } = Layout;

const persistor = async () => {
}

class App extends React.Component {
  public render() {
    return (
      <ResubPersistGate loading={null} persistor={persistor} >
        <BrowserRouter>
          <Layout style={{minHeight: "100vh"}}>
            <Sider />
            <Layout>
              <Content style={{margin: "20px"}}>
                <Switch>
                  <Route path="/" component={Editor} exact />
                  <Route path="/editor" component={Editor} />
                </Switch>
              </Content>
            </Layout>
          </Layout>
        </BrowserRouter>
      </ResubPersistGate>
    );
  }
}

export default App;
