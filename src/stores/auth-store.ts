import { observable, action } from "mobx";
import { AuthService } from "src/services";
import userStore from './user-store';
import { notification } from "antd";
import history from "src/utils/history";

interface RegisterErrorResponse {
    code: string,
    description: string
}

class AuthStore {

    @observable rememberMe: boolean = false;
    @observable savedCredentials = {
        username: ""
    }

    @action async login({ userName, password } : LoginRequestData) {
        try {
            const { tokens, user } = await AuthService.login(userName, password);
            userStore.setToken(tokens);
            userStore.setUser(user);
            history.push('/');
        } catch(e) {

            let errorMessage = "Unable to connect to service.";
            if(e.status) {
                if(e.status === 400 || e.status === 401) {
                    errorMessage = "Invalid username or password.";
                } else {
                    errorMessage = "An unknown error has occurred.";
                }
            }

            notification.error({ message: "Unable to login", description: errorMessage })
        }
    }

    @action async register(registerRequest : RegisterRequestData) {
        try {
            const { tokens, user } = await AuthService.register(registerRequest);
            userStore.setToken(tokens);
            userStore.setUser(user);
            history.push('/');
        } catch(e) {
            let errorMessage = "Unable to connect to service.";

            if(e.response && e.status === 400) {
                const responseText = JSON.parse(e.response.text) as Array<RegisterErrorResponse>;
                errorMessage = responseText.map(x => x.description).join('\n');
            }

            notification.error({ message: "Unable to register account", description: errorMessage });
        }
    }

    @action setRememberMe(rememberMe: boolean, savedCreds) {
        this.rememberMe = rememberMe;
        
        if(rememberMe) {
            this.savedCredentials = savedCreds;
        }
    }

    @action async logout() {
        try {
            await AuthService.logout();
        } catch(e) {
            console.warn(e);
        } finally {
            userStore.deleteUserInfo();
            history.push('/login');
        }
    }

}

export default new AuthStore();

export { AuthStore }