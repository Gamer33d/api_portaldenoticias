import { IRole, IRolesRepository } from "../../../entities/Roles";

export class GetRoleUseCase {
    constructor(
        private rolesRepository: IRolesRepository
    ){}
    
    async execute(roleId: number): Promise<IRole | undefined>{
        if(typeof roleId != "number"){
            roleId = Number(roleId)
        }
        if(!roleId){
            throw new Error('invalid id')
        }

        const role = await this.rolesRepository.getRoleById(roleId)

        return role
    }
    
}