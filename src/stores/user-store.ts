import { observable, computed, action } from "mobx";

class UserStore {

    @observable user?: User = {} as User;

    @computed get isLoggedIn() : boolean { return !!this.user; }

    @action setUser(user: User) {
        this.user = user;
    }

}

export default new UserStore();
export { UserStore }