import { BaseService } from "../../../services/base-service";
import { UserData, userStore } from "../../../stores/user-store";

class LoginService extends BaseService {

    public async login(loginDto: LoginDto) : Promise<UserData> {
        const response = await this.post<UserData>("account/login", loginDto);

        userStore.setToken(response.headers["token"]);
        userStore.setRefreshToken(response.headers["refreshtoken"]);
        return response.data;
    }

}

export interface LoginDto {
    username: string;
    password: string;
}

export const loginService = new LoginService();