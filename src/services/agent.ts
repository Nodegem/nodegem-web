import { userStore } from 'src/stores';
import _superagent, { SuperAgentRequest, SuperAgentStatic } from 'superagent';
import superagentPromise from 'superagent-promise';

const superagent = superagentPromise(
    _superagent,
    global.Promise
) as SuperAgentStatic;

const ROOT_URL = process.env.REACT_APP_API_BASE_URL;

const combinePath = url => `${ROOT_URL}/api${url}`;

const tokenPlugin = (req: SuperAgentRequest) => {
    if (userStore && userStore.getToken()) {
        req.set('Authorization', `Bearer ${userStore.getToken()}`);
    }
};

const responseBody = (res: _superagent.Response) => res.body;

const handleErrors = err => {
    if (err && err.response && err.response.status === 401) {
        //logout
    }

    return err;
};

const requests = {
    get: url =>
        superagent
            .get(combinePath(url))
            .use(tokenPlugin)
            .withCredentials()
            .then(responseBody, handleErrors),
    post: (url, body) =>
        superagent
            .post(combinePath(url), body)
            .use(tokenPlugin)
            .withCredentials()
            .then(responseBody, handleErrors),
    put: (url, body) =>
        superagent
            .put(combinePath(url), body)
            .use(tokenPlugin)
            .withCredentials()
            .then(responseBody, handleErrors),
    patch: (url, body) =>
        superagent
            .patch(combinePath(url), body)
            .use(tokenPlugin)
            .withCredentials()
            .then(responseBody, handleErrors),
    del: url =>
        superagent
            .del(combinePath(url))
            .use(tokenPlugin)
            .then(responseBody, handleErrors),
};

export { requests };
