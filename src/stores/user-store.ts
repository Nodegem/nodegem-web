import localforage from 'localforage';
import { action, computed, observable } from 'mobx';
import { Store } from 'overstated';
import { deleteFromStorage, getFromStorage, saveToStorage } from 'utils';
import routerHistory from 'utils/history';
import { jwtToUser, parseJwt } from './../utils/helpers';
import { AppStore } from './app-store';

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

interface IUserStoreState {
    token: TokenData;
    isLoggedIn: boolean;
}

export class UserStoreNew extends Store<IUserStoreState, AppStore> {
    public get user(): User {
        return jwtToUser(parseJwt(this.state.token.accessToken));
    }

    public get isLoggedIn(): boolean {
        return this.state.isLoggedIn;
    }

    public state: IUserStoreState = {
        isLoggedIn: false,
        token: undefined as any,
    };

    constructor() {
        super();
        this.loadTokenFromStorage();
    }

    private loadTokenFromStorage = async () => {
        const token = await localforage.getItem<TokenData>('session');
        await this.setToken(token);
    };

    public setToken = async (token: TokenData) => {
        this.setState({
            token,
            isLoggedIn: !!token && !!token.accessToken,
        });
        if (token) {
            await localforage.setItem('session', token);
            routerHistory.push('/');
        }
    };

    public logout = () => {
        this.setToken(undefined as any);
    };
}
