import { action, computed, observable } from 'mobx';

class UserStore {

    @observable user?: User;
    @observable tokens?: Tokens;

    @computed get isLoggedIn() : boolean { 
        return !!this.user && !!this.tokens && Object.keys(this.user).length > 0; 
    }

    @action setToken(tokenDto: Tokens) {
        this.tokens = tokenDto;
    }

    @action setUser(user?: User) {
        this.user = user;
    }

    @action deleteUserInfo() {
        this.tokens = undefined;
        this.user = undefined;
    }

}

export default new UserStore();
export { UserStore }