import { BaseService } from "../../../services/base-service";
import { UserData, userStore } from "../../../stores/user-store";

class LoginService extends BaseService {

    public async login(loginDto: LoginDto) : Promise<UserData> {
        const response = await this.post<UserData>("account/login", loginDto);

        const { token, refreshtoken } = response.headers;
        userStore.setTokens(token, refreshtoken);
        return response.data;
    }

    public async logout() {
        try {
            await this.get("account/logout");
        } catch(err) {
            console.error(err);
        }

        userStore.logout();
    }

    public async refreshTokens() {
        await this.updateTokens();
    }

}

export interface LoginDto {
    username: string;
    password: string;
}

export const loginService = new LoginService();