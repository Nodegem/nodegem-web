interface UserResponseData {
    id: string,
    userName: string,
    email: string,
    firstName: string,
    lastName: string,
    createdOn: Date,
    lastUpdated: Date,
    accessToken: string,
    refreshToken: string
}

interface LoginResponseData {
    accessToken: string,
    refreshToken: string,
    user: UserResponseData
}

interface RegisterResponseData extends LoginResponseData {
    
}

interface LoginRequestData {
    userName?: string,
    password: string
}

interface RegisterRequestData extends LoginRequestData {
    userName: string,
    email: string,
    firstName?: string,
    lastName?: string,
}