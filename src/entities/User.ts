export interface ICreateUserRequestDTO {
    avatarUrl?: string;
    name: string;
    email: string;
    password: string;
    roleId?: number;
}

export interface IEditUserRequestDTO {
    avatarUrl?: string;
    name?: string;
    email?: string;
    password?: string;
    roleId?: number;
    banned?: boolean
}


export interface IUser {
    avatarUrl?: string;
    id: string;
    name: string;
    email: string;
    password?: string;
    roleId?: number;
    banned: boolean;
}


export interface IUserLoginDTO {
    email: string;
    password: string;
}


export interface IUserRepository {
    getAllUsers(): Promise<IUser[]>
    createUser(userData: ICreateUserRequestDTO): Promise<IUser>
    findUserByEmailOrName(email: string | undefined, name: string | undefined): Promise<IUser | undefined>
    findUserById(id: string): Promise<IUser | undefined>
    editUser(user: IEditUserRequestDTO, id: string): Promise<IUser>
    deleteUserById(id: string): Promise<boolean>
}
