import * as React from 'react';
import './App.scss';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Editor from './features/Editor/Editor';
import ResubPersistGate from './components/ResubPersistGate/ResubPersistGate';
import { Layout } from 'antd';
import Sider from './features/Sider/Sider';
import { autoSave, rehydrate } from 'resub-persist/dist';
import { appStore } from './stores/AppStore';
import localforage from 'localforage';
import { editorStore } from './stores/EditorStore';

const { Content } = Layout;

const persistor = async () => {
  await rehydrate(localforage, [appStore, editorStore]);
  await autoSave(localforage, appStore);
  await autoSave(localforage, editorStore);
}

const EditorPage = () => <Editor size={[15000, 15000]} zoomRange={[.5, 1.5]} />;

class App extends React.PureComponent {

  public render() {

    return (
      <ResubPersistGate loading={null} persistor={persistor} >
        <BrowserRouter>
            <Layout style={{ minHeight: "100vh", height: "auto", margin: 0, padding: 0 }}>
              <Sider />
              <Layout>
                <Content style={{ padding: "20px", display: "flex", flexDirection: "column", minHeight: "100%" }}>
                  <Switch>
                    <Route path="/" component={EditorPage} exact />
                    <Route path="/editor" component={EditorPage} />
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
