import { BaseService } from "../../../services/base-service";
import { UserData, userStore } from "../../../stores/user-store";

class LoginService extends BaseService {

    public async login(loginDto: LoginDto) : Promise<LoginResponse> {
        const response = await this.post<LoginResponse>("account/login", loginDto);

        console.log(response);
        userStore.setToken(response.headers["token"]);
        userStore.setRefreshToken(response.headers["refreshtoken"]);
        return response.data;
    }

}

interface LoginResponse extends UserData {
}

export interface LoginDto {
    username: string;
    password: string;
}

export const loginService = new LoginService();