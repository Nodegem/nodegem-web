import { observable, action } from "mobx";
import { ignore } from "mobx-sync";

class UserStore {

    @observable
    token: string = "";

    @observable
    userData: UserData;  

    public setUserData = action((data: UserData) => {
        this.userData = data;
    })

    public setToken = action((token: string) => {
        this.token = token;
    })

}

export interface UserData {
    userName: string;
    email: string;
    firstName: string;
    lastName: string;
}

export const userStore = new UserStore();