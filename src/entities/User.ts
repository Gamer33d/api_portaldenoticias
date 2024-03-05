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
    avatarUrl?: string | null;
    id: string;
    name: string;
    email: string;
    password?: string;
    roleId?: number | null;
    banned: boolean;
    News?: []
}


export interface IUserLoginDTO {
    email: string;
    password: string;
}


export interface IUserRepository {
    getAllUsers(): Promise<IUser[]>
    createUser(userData: ICreateUserRequestDTO): Promise<IUser>
    findUserByEmailOrName(email: string | undefined, name: string | undefined): Promise<IUser | null>
    findUserById(id: string): Promise<IUser | null>
    editUser(user: IEditUserRequestDTO, id: string): Promise<IUser>
    deleteUserById(id: string): Promise<boolean>
}
