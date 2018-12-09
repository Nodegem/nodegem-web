import _superagent, { SuperAgentRequest } from 'superagent';
import commonStore from 'src/stores/common-store';

const superagent = _superagent;

const ROOT_URL = process.env.REACT_APP_API_BASE_URL;

const combinePath = url => `${ROOT_URL}${url}`;

const tokenPlugin = (req: _superagent.Request) => {
    if(commonStore.accessToken) {
        req.set("Authorization", `Bearer ${commonStore.accessToken}`);
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
    del: url =>
        superagent
        .del(combinePath(url))
        .use(tokenPlugin)
        .end(handleErrors)
        .then(responseBody)
}

export { requests }