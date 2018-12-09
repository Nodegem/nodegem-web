import { observable, computed, action } from "mobx";

class UserStore implements IUserStore {

    @observable user?: User;

    @computed get isLoggedIn() : boolean { return !!this.user; }

    @action setUser(user: User) {
        this.user = user;
    }

}

export default new UserStore();