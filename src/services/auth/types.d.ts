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

interface LoginRequestData {
    username?: string,
    email?: string,
    password: string
}

interface RegisterRequestData extends LoginRequestData {
    username: string,
    email: string,
    firstName?: string,
    lastName?: string
}