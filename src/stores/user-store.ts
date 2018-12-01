import { observable, action, computed } from "mobx";
import history from "src/utils/history";

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

    public setTokens = action((accessToken: string, refreshToken?: string) => {
        this.token = accessToken;
        this.refreshToken = refreshToken;
    })

    public logout = action(() => {
        this.token = undefined;
        this.userData = undefined;
        history.push("/login");
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