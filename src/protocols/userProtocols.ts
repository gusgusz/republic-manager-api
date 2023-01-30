

type NewUser = {
    name: string;
    email: string;
    password: string;
    createdAt?: Date;
}

type User = {
    email: string;
    password: string;
}

type Token = {
    id?: number;
    token: string;
    userId:number;
    createdAt: Date;
}
export { NewUser, User, Token };