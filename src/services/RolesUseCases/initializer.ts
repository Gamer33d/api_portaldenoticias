import { IRole } from "../../entities/Roles";
import { InMemoryRolesRepository } from "../../repositories/inMemory/InMemoryRolesRepository";
import { GetRoleUseCase } from "./GetRole/GetRoleUseCase";

const rolesPreset: IRole[] = [
    {
        id: 1,
        roleName: "Owner",
        permissions: ["*"]
    },
    {
        id: 2,
        roleName: "Moderator",
        permissions: ['manage_users', "manage_all_news"]
    },
    {
        id: 3,
        roleName: "Creator",
        permissions: ["manage_your_news"]
    }
]

const rolesRepository = new InMemoryRolesRepository(rolesPreset)
const getRoleUseCase = new GetRoleUseCase(rolesRepository, )


export { getRoleUseCase }