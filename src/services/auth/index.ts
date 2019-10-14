import superagent, { SuperAgentRequest } from 'superagent';
import { requests } from '../agent';
import { combinePath } from './../agent';

const AuthService = {
    login: (username, password): Promise<UserTokenData> => {
        return superagent
            .get(combinePath('/account/login'))
            .use((request: SuperAgentRequest) => {
                const encoded = btoa(`${username}:${password}`);
                request.set('Authorization', `Basic ${encoded}`);
                request.withCredentials();
            })
            .then(res => res.body);
    },
    logout: (): Promise<void> => requests.get('/account/logout'),
    register: (data: RegisterRequestData): Promise<UserTokenData> =>
        requests.post('/account/register', data),
};

export { AuthService };
