import './index.less';
import './styles/main.less';
import './utils/extensions';

import { Provider } from 'mobx-react';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router } from 'react-router';

import { StoreProvider } from 'stores/StoreProvider';
import App from './App';
import * as servicerWorker from './serviceWorker';
import * as stores from './stores';
import history from './utils/history';

ReactDOM.render(
    <>
        <Provider {...stores}>
            <StoreProvider>
                <Router history={history}>
                    <App />
                </Router>
            </StoreProvider>
        </Provider>
    </>,
    document.getElementById('root') as HTMLElement
);

servicerWorker.unregister();
