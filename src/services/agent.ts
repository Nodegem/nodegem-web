import { userStore } from 'stores';
import superagent, { SuperAgentRequest } from 'superagent';
import { sleep } from 'utils';

const ROOT_URL = process.env.REACT_APP_API_BASE_URL;

export const combinePath = url => `${ROOT_URL}/api${url}`;

const tokenPlugin = async (req: SuperAgentRequest) => {
    if (userStore && userStore.token) {
        console.log('before');
        await sleep(300);
        console.log('after');

        req.set('Authorization', `Bearer ${userStore.token.accessToken}`);
    }
};

const credentialPlugin = (req: SuperAgentRequest) => {
    req.withCredentials();
};

const responseBody = (res: superagent.Response) => res.body;

const handleErrors = err => {
    console.log(err);
    throw err;
};

const handleRetry = async (err, res: superagent.Response) => {
    if (err && err.response && err.response.status === 401) {
        const response = await superagent.get(
            combinePath(`/account/refreshToken/${userStore.token!.accessToken}`)
        );

        if (response.status === 200) {
            userStore.setToken(response.body);
        }
    }
};

const requests = {
    get: url =>
        superagent
            .get(combinePath(url))
            .use(tokenPlugin)
            .use(credentialPlugin)
            .retry(2, handleRetry)
            .then(responseBody)
            .catch(handleErrors),
    post: (url, body) =>
        superagent
            .post(combinePath(url), body)
            .use(tokenPlugin)
            .use(credentialPlugin)
            .retry(2, handleRetry)
            .then(responseBody)
            .catch(handleErrors),
    put: (url, body) =>
        superagent
            .put(combinePath(url), body)
            .use(tokenPlugin)
            .use(credentialPlugin)
            .retry(2, handleRetry)
            .then(responseBody)
            .catch(handleErrors),
    patch: (url, body) =>
        superagent
            .patch(combinePath(url), body)
            .use(tokenPlugin)
            .use(credentialPlugin)
            .retry(2, handleRetry)
            .then(responseBody)
            .catch(handleErrors),
    del: url =>
        superagent
            .del(combinePath(url))
            .use(tokenPlugin)
            .use(credentialPlugin)
            .retry(2, handleRetry)
            .then(responseBody)
            .catch(handleErrors),
};

export { requests };
