import localforage from 'localforage';
import { Store } from 'overstated';
import { AuthService } from 'services';
import routerHistory from 'utils/history';
import { jwtToUser, parseJwt } from './../utils/helpers';
import { AppStore } from './app-store';
import * as jsonpatch from 'fast-json-patch';
import { UserService } from 'services/user/user-service';

interface IUserStoreState {
    token: TokenData;
    isLoggedIn: boolean;
    user: User;
}

export class UserStore extends Store<IUserStoreState, AppStore> {
    public get user(): User {
        return this.state.user;
    }

    public get isLoggedIn(): boolean {
        return this.state.isLoggedIn;
    }

    public state: IUserStoreState = {
        isLoggedIn: false,
        token: undefined as any,
        user: {} as User,
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

        if (token) {
            this.setState({
                user: jwtToUser(parseJwt(this.state.token.accessToken)),
            });
        }
        await localforage.setItem('session', token);
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

    public patchUser = async (user: Partial<User>) => {
        const updatedUser = {
            ...this.user,
            ...user,
        };
        const patchDoc = jsonpatch.compare(this.user, updatedUser);

        try {
            const newTokenDto = await UserService.patchUser(
                this.user.id,
                patchDoc
            );
            this.setToken(newTokenDto);
        } catch (e) {
            this.ctx.openNotification({
                title: 'Update unsuccessful',
                type: 'error',
                closeBtn: true,
                description: 'Something went wrong',
            });
        }
    };

    public alreadyLinkedToProvider = (provider: Providers) => {
        return this.user.providers.includes(provider);
    };

    public logout = async () => {
        try {
            if (this.state.isLoggedIn) {
                await AuthService.logout();
            }
        } catch (e) {
            console.error(e);
        } finally {
            await this.setToken(undefined as any);
            await localforage.removeItem('session');
            this.ctx.openNotification({
                title: 'Successfully logged out!',
                description: '',
                type: 'success',
            });
            routerHistory.push('/login');
        }
    };
}
