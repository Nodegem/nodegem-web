interface UserTokenData {
    user: UserResponseData;
    token: TokenData;
}

interface UserResponseData {
    id: string;
    userName: string;
    email: string;
    firstName: string;
    lastName: string;
    createdOn: Date;
    lastUpdated: Date;
}

interface TokenData {
    accessToken: string;
    issuedUtc: Date;
    expiresUtc: Date;
}

interface LoginRequestData {
    userName?: string;
    password: string;
}

interface RegisterRequestData extends LoginRequestData {
    userName: string;
    email: string;
    firstName?: string;
    lastName?: string;
}
