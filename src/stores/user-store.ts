import localforage from 'localforage';
import { action, computed, observable } from 'mobx';
import { Store } from 'overstated';
import { AuthService } from 'services';
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
        return (
            (this.isLoggedIn &&
                jwtToUser(parseJwt(this.state.token.accessToken))) ||
            ({} as User)
        );
    }

    public get isLoggedIn(): boolean {
        return this.state.isLoggedIn;
    }

    public state: IUserStoreState = {
        isLoggedIn: false,
        token: undefined as any,
    };

    public loadStateFromStorage = async () => {
        const token = await localforage.getItem<TokenData>('session');
        await this.setToken(token);
    };

    public setToken = async (token: TokenData) => {
        await this.setState({
            token,
            isLoggedIn: !!token && !!token.accessToken,
        });

        if (!token) {
            await localforage.removeItem('session');
        } else {
            await localforage.setItem('session', token);
        }
    };

    public loginWithToken = async (token: string) => {
        try {
            const response = await AuthService.loginWithToken(token);
            this.setToken(response);

            routerHistory.push('/');
        } catch (e) {
            let errorMessage = 'Unable to connect to service.';
            if (e.status) {
                // tslint:disable-next-line: prefer-conditional-expression
                if (e.status === 400 || e.status === 401) {
                    errorMessage = 'Invalid username or password.';
                } else {
                    errorMessage = 'An unknown error has occurred.';
                }
            }

            this.ctx.openNotification({
                title: 'Unable to login',
                description: errorMessage,
            });
        }
    };

    public logout = async () => {
        try {
            await AuthService.logout();
            await this.setToken(undefined as any);
        } catch (e) {
            console.error(e);
        } finally {
            this.ctx.openNotification({
                title: 'Logged out!',
                description: '',
                type: 'success',
            });
        }
    };
}
