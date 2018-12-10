import { observable, computed, action } from "mobx";

class UserStore {

    @observable user?: User = {} as User;

    @computed get isLoggedIn() : boolean { return !!this.user; }

    @observable accessToken: string = "";
    @observable refreshToken: string = "";

    @action setToken({ accessToken, refreshToken }) { 
        this.accessToken = accessToken; 
        this.refreshToken = refreshToken;
    }

    @action setUser(user: User) {
        this.user = user;
    }

}

export default new UserStore();
export { UserStore }