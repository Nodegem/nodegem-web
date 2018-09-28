import { observable, action, computed } from "mobx";

class UserStore {

    @observable
    token?: string = "";

    @observable
    userData?: UserData;  

    @computed
    public get isAuthenticated() : boolean {
        return !!this.token;
    }

    public setUserData = action((data: UserData) => {
        this.userData = data;
    })

    public setToken = action((token: string) => {
        this.token = token;
    })

    public logout = action(() => {
        this.token = undefined;
        this.userData = undefined;
    })

}

export interface UserData {
    userName: string;
    email: string;
    firstName: string;
    lastName: string;
}

export const userStore = new UserStore();