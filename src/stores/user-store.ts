import { observable, computed, action, toJS } from "mobx";

class UserStore {

    @observable user?: User;

    @computed get isLoggedIn() : boolean { 
        return !!this.user && Object.keys(this.user).length > 0; 
    }

    @observable accessToken: string = "";
    @observable refreshToken: string = "";

    @action setToken({ accessToken, refreshToken }) { 
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
    }

    @action setUser(user?: User) {
        this.user = user;
    }

    @action deleteUserInfo() {
        this.accessToken = "";
        this.refreshToken = "";
        this.user = undefined;
    }

}

export default new UserStore();
export { UserStore }