export interface IRole{
    id: number;
    roleName: string;
    permissions: string[]
}

export interface IRolesRepository {
    getRoleById(id: number): Promise<IRole | undefined>
}