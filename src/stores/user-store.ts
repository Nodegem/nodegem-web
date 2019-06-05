import { action, computed, observable } from 'mobx';

import { IDisposableStore } from './';
import { getCookie } from 'src/utils';

class UserStore implements IDisposableStore {
    @observable user?: User;

    @computed get isLoggedIn(): boolean {
        return (
            !!this.user &&
            !!this.getToken() &&
            Object.keys(this.user).length > 0
        );
    }

    public getToken() {
        return getCookie('User-Token');
    }

    @action setUser(user?: User) {
        this.user = user;
    }

    @action dispose() {
        this.user = undefined;
    }
}

export default new UserStore();
export { UserStore };
