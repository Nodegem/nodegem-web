import { notification } from 'antd';
import { action, observable } from 'mobx';
import { AuthService } from 'services';
import routerHistory from 'utils/history';

import { saveToStorage } from 'utils';
import userStore from './user-store';

interface IRegisterErrorResponse {
    code: string;
    description: string;
}

class AuthStore {
    @observable public rememberMe: boolean = false;
    @observable public savedUsername: string = '';

    @observable
    public loading: boolean = false;

    @action public async login({ userName, password }: LoginRequestData) {
        this.setLoading(true);
        try {
            const response = await AuthService.login(userName, password);
            userStore.setUser(response.user);
            userStore.setToken(response.token);

            routerHistory.push('/');
        } catch (e) {
            let errorMessage = 'Unable to connect to service.';
            if (e.status) {
                // tslint:disable-next-line: prefer-conditional-expression
                if (e.status === 400 || e.status === 401) {
                    errorMessage = 'Invalid username or password.';
                } else {
                    errorMessage = 'An unknown error has occurred.';
                }
            }

            notification.error({
                message: 'Unable to login',
                description: errorMessage,
            });
        } finally {
            this.setLoading(false);
        }
    }

    @action public async register(registerRequest: RegisterRequestData) {
        this.setLoading(true);
        try {
            const response = await AuthService.register(registerRequest);
            userStore.setUser(response.user);
            userStore.setToken(response.token);
            routerHistory.push('/');
        } catch (e) {
            let errorMessage = 'Unable to connect to service.';

            if (e.response && e.status === 400) {
                const responseText = JSON.parse(
                    e.response.text
                ) as IRegisterErrorResponse[];
                errorMessage = responseText.map(x => x.description).join('\n');
            }

            notification.error({
                message: 'Unable to register account',
                description: errorMessage,
            });
        } finally {
            this.setLoading(false);
        }
    }

    @action public setRememberMe(rememberMe: boolean, savedUsername: string) {
        this.rememberMe = rememberMe;

        if (rememberMe) {
            this.savedUsername = savedUsername;
            saveToStorage('rememberInfo', {
                rememberMe: this.rememberMe,
                username: this.savedUsername,
            });
        }
    }

    @action public setLoading(loading: boolean) {
        this.loading = loading;
    }

    @action public async logout(makeCall = true) {
        try {
            if (makeCall) {
                await AuthService.logout();
            }
        } catch (e) {
            console.warn(e);
        } finally {
            userStore.dispose();
            routerHistory.push('/login');
        }
    }
}

export default new AuthStore();
export { AuthStore };
