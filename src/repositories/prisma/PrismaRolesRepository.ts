import { IRole, IRolesRepository } from "../../entities/Roles";
import { prisma } from "../../infrastructure/db/PrismaClient";

export class PrismaRolesRepository implements IRolesRepository{
    async getRoleById(id: number): Promise<IRole | null> {    
        const role = await prisma.roles.findFirst({
            where: {
                id
            }
        })

        return role
    }
}