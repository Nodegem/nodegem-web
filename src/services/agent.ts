import { appStore } from 'stores';
import superagent, { SuperAgentRequest } from 'superagent';

const ROOT_URL = process.env.REACT_APP_API_BASE_URL;

export const combinePath = url => `${ROOT_URL}/api${url}`;

const tokenPlugin = (req: SuperAgentRequest) => {
    const { isLoggedIn, state } = appStore.userStore;
    if (isLoggedIn) {
        req.set('Authorization', `Bearer ${state.token.accessToken}`);
    }
};

const credentialPlugin = (req: SuperAgentRequest) => {
    req.withCredentials();
};

const responseBody = (res: superagent.Response) => res.body;

const handleErrors = err => {
    if (err && err.response && err.response.status === 401) {
        // logout
    }

    throw err.response;
};

const requests = {
    get: url =>
        superagent
            .get(combinePath(url))
            .timeout({
                response: 45000,
                deadline: 60000,
            })
            .use(tokenPlugin)
            .use(credentialPlugin)
            .then(responseBody, handleErrors),
    post: (url, body) =>
        superagent
            .post(combinePath(url), body)
            .timeout({
                response: 45000,
                deadline: 60000,
            })
            .use(tokenPlugin)
            .use(credentialPlugin)
            .then(responseBody, handleErrors),
    put: (url, body) =>
        superagent
            .put(combinePath(url), body)
            .timeout({
                response: 45000,
                deadline: 60000,
            })
            .use(tokenPlugin)
            .use(credentialPlugin)
            .then(responseBody, handleErrors),
    patch: (url, body) =>
        superagent
            .patch(combinePath(url), body)
            .timeout({
                response: 45000,
                deadline: 60000,
            })
            .use(tokenPlugin)
            .use(credentialPlugin)
            .then(responseBody, handleErrors),
    del: url =>
        superagent
            .del(combinePath(url))
            .timeout({
                response: 45000,
                deadline: 60000,
            })
            .use(tokenPlugin)
            .use(credentialPlugin)
            .then(responseBody, handleErrors),
};

export { requests };
