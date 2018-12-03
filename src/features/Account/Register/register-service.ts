import { BaseService } from "../../../services/base-service";
import { UserData, userStore } from "../../../stores/user-store";

class RegisterService extends BaseService {

    public registerUser = async (registerDto: RegisterDto) : Promise<UserData> => {
        const response = await this.post<UserData>("account/register", registerDto);
        const { token, refreshtoken } = response.headers;
        userStore.setTokens(token, refreshtoken);
        return response.data;
    }

}

interface RegisterDto {
    email: string;
    userName: string;
    password: string;
    firstName?: string;
    lastName?: string;
}

export const registerService = new RegisterService();