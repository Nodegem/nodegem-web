import { action, computed, observable } from 'mobx';
import { IDisposableStore } from '.';

class UserStore implements IDisposableStore {

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

    @action dispose() {
        this.user = undefined;
        this.tokens = undefined;
    }

}

export default new UserStore();
export { UserStore }