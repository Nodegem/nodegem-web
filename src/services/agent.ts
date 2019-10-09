import { authStore, userStore } from 'stores';
import superagent, { SuperAgentRequest } from 'superagent';

const ROOT_URL = process.env.REACT_APP_API_BASE_URL;

export const combinePath = url => `${ROOT_URL}/api${url}`;

const tokenPlugin = async (req: SuperAgentRequest) => {
    if (userStore && userStore.token) {
        req.set('Authorization', `Bearer ${userStore.token.accessToken}`);
    }
};

const credentialPlugin = (req: SuperAgentRequest) => {
    req.withCredentials();
};

const makeRequest = async <T = void>(
    request: () => superagent.SuperAgentRequest
): Promise<T> => {
    return makeRequestHelper(request);
};

const maxAttempts = 1;

const makeRequestHelper = async <T = void>(
    request: () => superagent.SuperAgentRequest,
    attempts = 0
): Promise<T> => {
    try {
        const response = await request()
            .use(tokenPlugin)
            .use(credentialPlugin);
        return response.body;
    } catch (ex) {
        console.log(ex);
        if (attempts <= maxAttempts) {
            if (ex.status === 401 && userStore && userStore.token) {
                const refreshedTokenResponse = await superagent
                    .get(
                        combinePath(
                            `/account/refreshToken/${userStore.token.accessToken}`
                        )
                    )
                    .ok(
                        res =>
                            res.status === 200 ||
                            res.status === 400 ||
                            res.status === 401
                    );
                if (refreshedTokenResponse.status === 200) {
                    userStore.setToken(refreshedTokenResponse.body);
                    return makeRequestHelper(request, attempts + 1);
                }
            }
        }

        await superagent
            .get('/account/logout')
            .use(tokenPlugin)
            .use(credentialPlugin);
        await authStore.logout(false);
        throw new Error(ex);
    }
};

const agent = superagent.agent();

const requests = {
    get: <T = void>(url) => makeRequest<T>(() => agent.get(combinePath(url))),
    post: <T = void>(url, body) =>
        makeRequest<T>(() => agent.post(combinePath(url), body)),
    put: <T = void>(url, body) =>
        makeRequest<T>(() => agent.put(combinePath(url), body)),
    patch: <T = void>(url, body) =>
        makeRequest<T>(() => agent.patch(combinePath(url), body)),
    del: <T = void>(url) =>
        makeRequest<T>(() => agent.delete(combinePath(url))),
};

export { requests };
