import localforage from 'localforage';
import { Store } from 'overstated';
import { AuthService } from 'services';
import routerHistory from 'utils/history';
import { jwtToUser, parseJwt } from './../utils/helpers';
import { AppStore } from './app-store';

interface IUserStoreState {
    token: TokenData;
    isLoggedIn: boolean;
}

export class UserStore extends Store<IUserStoreState, AppStore> {
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
            await this.setToken(response);
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
            if (this.state.isLoggedIn) {
                await AuthService.logout();
            }
            await this.setToken(undefined as any);
        } catch (e) {
            console.error(e);
        } finally {
            this.ctx.openNotification({
                title: 'Successfully logged out!',
                description: '',
                type: 'success',
            });
            routerHistory.push('/');
        }
    };
}
