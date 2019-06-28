import { combinePath } from './../agent';
import { requests } from '../agent';
import superagent, { SuperAgentRequest } from 'superagent';

const AuthService = {
    login: (username, password): Promise<UserResponseData> => {
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
    register: (data: RegisterRequestData): Promise<UserResponseData> =>
        requests.post('/account/register', data),
};

export { AuthService };
