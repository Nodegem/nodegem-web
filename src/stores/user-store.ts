import { observable, action, computed } from "mobx";
import history from "src/utils/history";
import { ignore } from "mobx-sync";
import { loginService } from "src/features/Account/Login/login-service";

const refreshBufferTime = parseInt(process.env.REACT_APP_TOKEN_BUFFER_TIME_IN_SECONDS!) * 1000;

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
    private refreshBuffer: number = 0;

    @ignore
    private refreshTimerId?: NodeJS.Timeout;

    @computed
    public get canRefresh() : boolean {
        return performance.now() - this.refreshBuffer >= refreshBufferTime;
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
    public setTokens = (accessToken: string, refreshToken: string) => {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
    }

    @action
    public updateRefreshBuffer = () => {
        this.refreshBuffer = performance.now();
    }

    @action
    public logout = () => {
        this.accessToken = undefined;
        this.refreshToken = undefined;
        this.userData = undefined;
        history.push("/login");
    }

    public setRefreshTokenInterval = () => {
        if(!this.refreshTimerId) {
            const refreshTokenTime = parseInt(process.env.REACT_APP_TOKEN_REFRESH_TIME_IN_SECONDS!) * 1000;
            this.refreshTimerId = setInterval(() => loginService.refreshTokens(), refreshTokenTime);
        }
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