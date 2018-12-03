import { observable, action, computed } from "mobx";
import history from "src/utils/history";
import { rootStore } from "./root-store";
import { ignore } from "mobx-sync";

class UserStore {

    @observable
    accessToken?: string = "";

    @observable
    refreshToken?: string = "";

    @observable
    userData?: UserData;  

    @observable
    rememberMe: boolean = false;

    @observable
    rememberedData: RememberedUserData;

    @ignore
    @observable
    private lastRefreshTime: Date = new Date();

    @computed
    public get shouldRefresh() : boolean {
        return Math.abs(new Date().getUTCMilliseconds() - this.lastRefreshTime.getUTCMilliseconds()) >= 5000;
    }

    @computed
    public get isAuthenticated() : boolean {
        return !!this.accessToken && !!this.refreshToken;
    }

    @action
    public setRememberMe = (value: boolean) => {
        this.rememberMe = value;
    }

    @action
    public setRememberedUserData = (value: RememberedUserData) => {
        this.rememberedData = value;
    }

    @action
    public setUserData = (data: UserData) => {
        this.userData = data;
    }

    @action
    public setTokens = (accessToken: string, refreshToken?: string) => {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.lastRefreshTime = new Date();
    }

    @action
    public updateRefreshTime = () => {
        this.lastRefreshTime = new Date();
    }

    @action
    public logout = () => {
        this.accessToken = undefined;
        this.refreshToken = undefined;
        this.userData = undefined;
        history.push("/login");
    }

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