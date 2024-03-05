import { IRole, IRolesRepository } from "../../entities/Roles";

export class InMemoryRolesRepository implements IRolesRepository{
    private roles: IRole[] = []
    constructor(presetRoles: IRole[]){
        this.roles = presetRoles
    }

    async getRoleById(id: number): Promise<IRole | null> {
        const role = this.roles.find(role => role.id == id) || null
        return role
    }
}