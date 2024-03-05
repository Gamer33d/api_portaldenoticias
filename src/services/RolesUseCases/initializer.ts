import { IRole } from "../../entities/Roles";
import { InMemoryRolesRepository } from "../../repositories/inMemory/InMemoryRolesRepository";
import { PrismaRolesRepository } from "../../repositories/prisma/PrismaRolesRepository";
import { GetRoleUseCase } from "./GetRole/GetRoleUseCase";


const rolesRepository = new PrismaRolesRepository()
const getRoleUseCase = new GetRoleUseCase(rolesRepository)


export { getRoleUseCase }