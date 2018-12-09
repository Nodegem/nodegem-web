import commonStore from 'src/stores/common-store';
import { observable, action } from "mobx";
import { Auth } from "src/services";
import userStore from './user-store';

const initialState : RegisterRequestData = {
    username: "",
    email: "",
    password: ""
};

class AuthStore {

    @observable values: RegisterRequestData = initialState
    @observable errors: any;

    @action reset() {
        this.values = initialState;
    }

    @action async login() {
        try {
            const username = this.values.username ? this.values.username : this.values.email;
            const user = await Auth.login(username, this.values.password);
            commonStore.setToken(user);
            userStore.setUser(user);
        } catch(e) {
            if(e.response && e.response.body && e.response.body.errors) {
                this.errors = e.response.body.errors;
            }
        }
    }

    @action async register() {
        try {
            const user = await Auth.register(this.values);
            commonStore.setToken(user);
            userStore.setUser(user);
        } catch(e) {
            if(e.response && e.response.body && e.response.body.errors) {
                this.errors = e.response.body.errors;
            }
        }
    }

}

export default new AuthStore();