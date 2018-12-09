import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./App";
import "./index.less";
import registerServiceWorker from "./registerServiceWorker";

import history from "./utils/history";

import { AsyncTrunk } from "mobx-sync";
import DevTools from "mobx-react-devtools";
import { Router } from "react-router";
import LocalForage from "localforage";
import { Provider } from "mobx-react";
import commonStore from "./stores/common-store";
import authStore from "./stores/auth-store";
import appStore from "./stores/app-store";
import userStore from "./stores/user-store";
import { BrowserRouter, HashRouter } from "react-router-dom";

const syncStores = {
    commonStore,
    appStore,
    userStore
}

const trunk = new AsyncTrunk(
    syncStores,
    {
        storage: LocalForage as any
    }
);

trunk.init().then(() => {});

const stores = {
  commonStore,
  authStore,
  appStore,
  userStore
}

ReactDOM.render((
    <>
        <Provider {...stores}>
            <Router history={history}>
                <App />
            </Router>
        </Provider>
        <DevTools />
    </>
    ),
    document.getElementById("root") as HTMLElement
);
registerServiceWorker();
