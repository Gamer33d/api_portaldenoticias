export interface ICreateUserRequestDTO{
    name: string;
    email: string;
    password: string;
    roleId?: number;
}


export interface IUserLogged{
    id: string;
    name: string;
    email: string;
    roleId?: number;
    banned: boolean;
}
export interface IUser extends IUserLogged{
    password: string;
}

export interface IUserLoginDTO{
    email: string;
    password: string;
}


export interface IUserRepository {
    createUser(userData: ICreateUserRequestDTO): Promise<IUser>
    findUserByEmailOrName(email: string, name: string | null): Promise<IUser | null>
    // editUserByEmail(email: string): Promise<IUser | null>
    // deleteUserByEmail(email: string): Promise<IUser | null>
}
