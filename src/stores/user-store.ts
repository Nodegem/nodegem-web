import { action, computed, observable } from 'mobx';
import { deleteFromStorage, getFromStorage, saveToStorage } from 'utils';

class UserStore implements IDisposableStore {
    @observable public user?: User;
    @observable public token?: TokenData;

    constructor() {
        this.user = getFromStorage<User>('user')!;
        this.token = getFromStorage<TokenData>('token')!;
    }

    @computed get isLoggedIn(): boolean {
        return !!this.user && !!this.token && Object.keys(this.user).length > 0;
    }

    @action public setToken(token: TokenData) {
        this.token = token;
        saveToStorage('token', token);
    }

    @action public setUser(user?: User) {
        this.user = user;
        saveToStorage('user', user);
    }

    @action public dispose() {
        deleteFromStorage('user', 'token');
        this.token = undefined;
        this.user = undefined;
    }
}

export default new UserStore();
export { UserStore };
