import { BaseService } from "../../../services/base-service";

class RegisterService extends BaseService {

    public registerUser = async (registerDto: RegisterDto) : Promise<RegisterDto> => {
        const response = await this.post<RegisterDto>("account/register", registerDto);
        return response.data;
    }

}

export interface RegisterDto {
    email: string;
    userName: string;
    password: string;
    firstName?: string;
    lastName?: string;
}

export const registerService = new RegisterService();