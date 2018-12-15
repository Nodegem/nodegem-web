import { requests } from '../agent';

const AuthService = {
    login: (username, password) : Promise<LoginResponseData> => 
        requests.post("/account/login", { username, password }),
    logout: () : Promise<void> =>
        requests.get('/account/logout'),
    register: (data: RegisterRequestData) : Promise<RegisterResponseData> => 
        requests.post("/account/register", data)
}

export { AuthService };