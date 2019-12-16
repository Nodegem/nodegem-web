interface User {
    id: string;
    userName: string;
    email: string;
    firstName?: string;
    lastName?: string;
    constants: IConstant[];
    avatarUrl: string;
    providers: string[];
}

interface IConstant {
    key: string;
    label: string;
    type: ValueType;
    value: any;
    isSecret: boolean;
}
