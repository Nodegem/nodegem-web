import { action, computed, observable } from 'mobx';
import { deleteFromStorage, getFromStorage, saveToStorage } from 'utils';
import { jwtToUser, parseJwt } from './../utils/helpers';

class UserStore implements IDisposableStore {
    @observable public token?: TokenData;

    @computed
    public get user(): User | undefined {
        return this.token && jwtToUser(parseJwt(this.token.accessToken));
    }

    @computed
    public get username(): string {
        return (this.user && this.user.userName) || '';
    }

    @computed get isLoggedIn(): boolean {
        return !!this.user && !!this.token && Object.keys(this.user).length > 0;
    }

    constructor() {
        this.init();
    }

    @action
    public init() {
        this.token = getFromStorage<TokenData>('token')!;
    }

    @action public setToken(token: TokenData) {
        this.token = token;
        saveToStorage('token', token);
    }

    @action public dispose() {
        deleteFromStorage('user', 'token');
        this.token = undefined;
    }
}

export default new UserStore();
export { UserStore };
