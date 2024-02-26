export interface ICreateUserRequestDTO{
    name: string;
    email: string;
    password: string;
    roleId?: number;
}

export interface IUser{
    id: string;
    name: string;
    email: string;
    password: string;
    roleId?: number;
    banned: boolean;
}



export interface IUserRepository {
    createUser(userData: ICreateUserRequestDTO): Promise<IUser>
    findUserByEmailOrName(email: string, name: string): Promise<IUser | null>
    // editUserByEmail(email: string): Promise<IUser | null>
    // deleteUserByEmail(email: string): Promise<IUser | null>
}
