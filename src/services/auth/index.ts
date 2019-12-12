import superagent, { SuperAgentRequest } from 'superagent';
import { requests } from '../agent';
import { combinePath } from './../agent';
import { Operation } from 'fast-json-patch';

const AuthService = {
    login: (username, password): Promise<TokenData> => {
        return superagent
            .get(combinePath('/account/login'))
            .timeout({
                response: 45000,
                deadline: 60000,
            })
            .use((request: SuperAgentRequest) => {
                const encoded = btoa(`${username}:${password}`);
                request.set('Authorization', `Basic ${encoded}`);
                request.withCredentials();
            })
            .then(
                res => res.body,
                err => {
                    throw err.response;
                }
            );
    },
    loginWithToken: (token: string): Promise<TokenData> => {
        return superagent
            .get(combinePath('/account/login-token'))
            .timeout({
                response: 45000,
                deadline: 60000,
            })
            .use((request: SuperAgentRequest) => {
                request.set('Authorization', `Bearer ${token}`);
            })
            .then(res => res.body);
    },
    loginGoogle: (): string => {
        return (
            combinePath('/oauth/external-login') +
            '?provider=Google' +
            `&returnUrl=${document.location.origin}/register/external`
        );
    },
    loginGitHub: (): string => {
        return (
            combinePath('/oauth/external-login') +
            '?provider=GitHub' +
            `&returnUrl=${document.location.origin}/register/external`
        );
    },
    logout: (): Promise<void> => requests.get('/account/logout'),
    forgotPassword: (email: string): Promise<void> =>
        requests.post('/account/forgot-password', { email }),
    patchUser: (userId: string, operation: Operation): Promise<User> =>
        requests.patch(`/account/update/${userId}`, operation),
    register: (data: RegisterRequestData): Promise<TokenData> =>
        requests.post('/account/register', data),
    updateUser: (data: User): Promise<User> =>
        requests.post('/account/update', data),
    resetPassword: (
        currentPassword: string,
        newPassword: string,
        confirmPassword: string
    ): Promise<boolean> =>
        requests.post('/account/reset-password', {
            currentPassword,
            newPassword,
            confirmNewPassword: confirmPassword,
        }),
    resetPasswordWithToken: (
        userId: string,
        token: string,
        password: string,
        confirmPassword: string
    ): Promise<boolean> =>
        requests.post('/account/reset-password-with-token', {
            userId,
            resetToken: token,
            newPassword: password,
            confirmNewPassword: confirmPassword,
        }),
    emailConfirmation: (userId: string, token: string): Promise<void> =>
        requests.get(
            `/account/email-confirmation?userId=${userId}&token=${token}`
        ),
};

export { AuthService };
