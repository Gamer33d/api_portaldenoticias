export interface ICreateUserRequestDTO{
    avatarUrl?: string;
    name: string;
    email: string;
    password: string;
    roleId?: number;
}

export interface IEditUserRequestDTO{
    avatarUrl?: string;
    name?: string;
    email?: string;
    password?: string;
    roleId?: number;
    banned?: boolean
}


export interface IUserLogged{
    avatarUrl?: string;
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
    findUserByEmailOrName(email: string, name: string | undefined): Promise<IUser | undefined>
    findUserById(id: string): Promise<IUser | undefined>
    editUser(user: IEditUserRequestDTO, id: string): Promise<IUser | undefined>
    // deleteUserByEmail(email: string): Promise<IUser | undefined>
}
