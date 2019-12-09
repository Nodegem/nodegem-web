import { requests, combinePath } from '../agent';
import { Operation } from 'fast-json-patch';

const UserService = {
    linkGoogle: (userId: string): string => {
        return (
            combinePath(`/oauth/link-external-account/${userId}`) +
            '?provider=Google' +
            `&returnUrl=${document.location.origin}/profile`
        );
    },
    linkGithub: (userId: string): string => {
        return (
            combinePath(`/oauth/link-external-account/${userId}`) +
            '?provider=GitHub' +
            `&returnUrl=${document.location.origin}/profile`
        );
    },
    patchUser: (userId: string, operation: Operation[]): Promise<TokenData> =>
        requests.patch(`/account/update/${userId}`, operation),
};

export { UserService };
