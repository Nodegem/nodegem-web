import { requests } from "../agent";

const Auth = {
    login: (username, password) : Promise<UserResponseData> => 
        requests.post("/accounts/login", { username, password }),
    register: (data: RegisterRequestData) : Promise<UserResponseData> => 
        requests.post("/accounts/register", data)
}

export { Auth };