import superagentPromise from 'superagent-promise';
import _superagent, { SuperAgentRequest, SuperAgentStatic } from 'superagent';
import { userStore } from 'src/stores';

const superagent = superagentPromise(_superagent, global.Promise) as SuperAgentStatic;

const ROOT_URL = process.env.REACT_APP_API_BASE_URL;

const combinePath = url => `${ROOT_URL}/api${url}`;

const tokenPlugin = (req: SuperAgentRequest) => {
    if(userStore && userStore.accessToken) {
        req.set("Authorization", `Bearer ${userStore.accessToken}`);
    }
}

const responseBody = (res: _superagent.Response) => res.body;

const handleErrors = err => {
    if(err && err.response && err.response.status === 401) {
        //logout
    }

    return err;
}

const requests = {
    get: url => 
        superagent
            .get(combinePath(url))
            .use(tokenPlugin)
            .end(handleErrors)
            .then(responseBody),
    post: (url, body) => 
        superagent
            .post(combinePath(url), body)
            .use(tokenPlugin)
            .end(handleErrors)
            .then(responseBody),
    put: (url, body) =>
        superagent
            .put(combinePath(url), body)
            .use(tokenPlugin)
            .end(handleErrors)
            .then(responseBody),
    patch: (url, body) =>
        superagent
            .patch(combinePath(url), body)
            .use(tokenPlugin)
            .end(handleErrors)
            .then(responseBody),
    del: url =>
        superagent
            .del(combinePath(url))
            .use(tokenPlugin)
            .end(handleErrors)
            .then(responseBody)
}

export { requests }