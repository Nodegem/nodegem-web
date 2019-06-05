import { notification } from 'antd';
import { action, observable } from 'mobx';
import { AuthService } from 'src/services';
import history from 'src/utils/history';

import { rootStore } from './';
import userStore from './user-store';

interface RegisterErrorResponse {
    code: string;
    description: string;
}

class AuthStore {
    @observable rememberMe: boolean = false;
    @observable savedCredentials = {
        username: '',
    };
    @observable loading: boolean = false;

    @action async login({ userName, password }: LoginRequestData) {
        this.setLoading(true);
        try {
            const response = await AuthService.login(userName, password);
            userStore.setUser(response);
            history.push('/');
        } catch (e) {
            let errorMessage = 'Unable to connect to service.';
            if (e.status) {
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

    @action async register(registerRequest: RegisterRequestData) {
        this.setLoading(true);
        try {
            const response = await AuthService.register(registerRequest);
            userStore.setUser(response);
            history.push('/');
        } catch (e) {
            let errorMessage = 'Unable to connect to service.';

            if (e.response && e.status === 400) {
                const responseText = JSON.parse(e.response.text) as Array<
                    RegisterErrorResponse
                >;
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

    @action setRememberMe(rememberMe: boolean, savedCreds) {
        this.rememberMe = rememberMe;

        if (rememberMe) {
            this.savedCredentials = savedCreds;
        }
    }

    @action setLoading(loading: boolean) {
        this.loading = loading;
    }

    @action async logout() {
        try {
            await AuthService.logout();
        } catch (e) {
            console.warn(e);
        } finally {
            rootStore.dispose();
            history.push('/login');
        }
    }
}

export default new AuthStore();

export { AuthStore };
