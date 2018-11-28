import { observable, action, computed } from "mobx";

class UserStore {

    @observable
    token?: string = "";

    @observable
    refreshToken?: string = "";

    @observable
    userData?: UserData;  

    @observable
    rememberMe: boolean = false;

    @observable
    rememberedData: RememberedUserData;

    @computed
    public get isAuthenticated() : boolean {
        return !!this.token && !!this.refreshToken;
    }

    public setRememberMe = action((value: boolean) => {
        this.rememberMe = value;
    })

    public setRememberedUserData = action((value: RememberedUserData) => {
        this.rememberedData = value;
    })

    public setUserData = action((data: UserData) => {
        this.userData = data;
    })

    public setToken = action((token: string) => {
        this.token = token;
    })

    public setRefreshToken = action((token: string) => {
        this.refreshToken = token;
    })

    public logout = action(() => {
        this.token = undefined;
        this.userData = undefined;
    })

}

export interface RememberedUserData {
    username: string;
}

export interface UserData {
    userName: string;
    email: string;
    firstName: string;
    lastName: string;
}

export const userStore = new UserStore();