import { observable, reaction, action, computed } from "mobx";

class CommonStore {

    @observable accessToken: string = "";
    @observable refreshToken: string = "";

    @action setToken({ accessToken, refreshToken }) { 
        this.accessToken = accessToken; 
        this.refreshToken = refreshToken;
    }

}

export default new CommonStore();