import { BaseService } from "../../../services/base-service";
import { UserData } from "../../../stores/user-store";

class RegisterService extends BaseService {

    public registerUser = async (registerDto: RegisterDto) : Promise<RegisterResponse> => {
        const response = await this.post<RegisterResponse>("account/register", registerDto);
        return response.data;
    }

}

export interface RegisterResponse {
    token: string;
    user: UserData;
}

interface RegisterDto {
    email: string;
    userName: string;
    password: string;
    firstName?: string;
    lastName?: string;
}

export const registerService = new RegisterService();