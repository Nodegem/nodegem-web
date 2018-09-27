import { UserData } from './../../stores/user-store';
import { BaseService } from "../../services/base-service";

class LoginService extends BaseService {

    public login = async (loginDto: LoginDto) : Promise<LoginResponse> => {
        const response = await this.post<LoginResponse>("account/login", loginDto);
        return response.data;
    }

}

interface LoginResponse {
    token: string;
    user: UserData
}

export interface LoginDto {
    username: string;
    password: string;
}

export const loginService = new LoginService();