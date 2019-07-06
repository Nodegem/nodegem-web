import { action, computed, observable } from 'mobx';
import { IDisposableStore } from './';

class UserStore implements IDisposableStore {
    @observable public user?: User;
    @observable public token?: TokenData;

    @computed get isLoggedIn(): boolean {
        return !!this.user && !!this.token && Object.keys(this.user).length > 0;
    }

    @action public setToken(token: TokenData) {
        this.token = token;
    }

    @action public setUser(user?: User) {
        this.user = user;
    }

    @action public dispose() {
        this.token = undefined;
        this.user = undefined;
    }
}

export default new UserStore();
export { UserStore };
