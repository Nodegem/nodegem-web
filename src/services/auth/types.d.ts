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

interface Tokens {
    accessToken: string,
    refreshToken: string,
    issuedUtc: Date,
    expiresUtc: Date
}

interface LoginResponseData {
    tokens: Tokens,
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