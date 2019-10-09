import { userStore } from 'stores';
import superagent, { SuperAgentRequest } from 'superagent';

const ROOT_URL = process.env.REACT_APP_API_BASE_URL;

export const combinePath = url => `${ROOT_URL}/api${url}`;

const tokenPlugin = (req: SuperAgentRequest) => {
    if (userStore && userStore.token) {
        req.set('Authorization', `Bearer ${userStore.token.accessToken}`);
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

    throw err;
};

const requests = {
    get: url =>
        superagent
            .get(combinePath(url))
            .use(tokenPlugin)
            .use(credentialPlugin)
            .then(responseBody, handleErrors),
    post: (url, body) =>
        superagent
            .post(combinePath(url), body)
            .use(tokenPlugin)
            .use(credentialPlugin)
            .then(responseBody, handleErrors),
    put: (url, body) =>
        superagent
            .put(combinePath(url), body)
            .use(tokenPlugin)
            .use(credentialPlugin)
            .then(responseBody, handleErrors),
    patch: (url, body) =>
        superagent
            .patch(combinePath(url), body)
            .use(tokenPlugin)
            .use(credentialPlugin)
            .then(responseBody, handleErrors),
    del: url =>
        superagent
            .del(combinePath(url))
            .use(tokenPlugin)
            .use(credentialPlugin)
            .then(responseBody, handleErrors),
};

export { requests };
