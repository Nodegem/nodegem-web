import * as React from 'react';
import './App.scss';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Editor from 'src/features/Editor/Editor';
import ResubPersistGate from './components/ResubPersistGate/ResubPersistGate';
import { Layout } from 'antd';
import Sider from 'src/features/Sider/Sider';
import { HotKeys } from 'react-hotkeys';

const { Content } = Layout;

const map = {

};

const persistor = async () => {
}

const EditorPage = () => <Editor size={[15000, 15000]} gridSpacing={20} dotSize={2} zoomRange={[.75, 2.5]} />;

class App extends React.Component {
  public render() {
    return (
      <HotKeys keyMap={map}>
        <ResubPersistGate loading={null} persistor={persistor} >
          <BrowserRouter>
            <Layout style={{minHeight: "100vh", height: "100%", margin: 0, padding: 0}}>
              <Sider />
              <Layout>
                <Content style={{padding: "20px", display: "flex", flexDirection: "column", minHeight: "100%"}}>
                  <Switch>
                    <Route path="/" component={EditorPage} exact />
                    <Route path="/editor" component={EditorPage} />
                  </Switch>
                </Content>
              </Layout>
            </Layout>
          </BrowserRouter>
        </ResubPersistGate>
      </HotKeys>
    );
  }
}

export default App;
