import { IRole } from "../../../src/entities/Roles";
import { InMemoryRolesRepository } from "../../../src/repositories/inMemory/InMemoryRolesRepository";
import { GetRoleUseCase } from "../../../src/services/RolesUseCases/GetRole/GetRoleUseCase";
import { describe, it, expect } from 'vitest'

describe('get a role', () => {
    const rolesPreset: IRole[] = [
        {
            id: 1,
            roleName: "Owner",
            permissions: ["*"]
        },
        {
            id: 2,
            roleName: "Moderator",
            permissions: ['manage_creators', "manage_all_news"]
        },
        {
            id: 3,
            roleName: "Creator",
            permissions: ["manage_your_news"]
        }
    ]
    
    it('should be able to get a role by id', async () => {
        const inMemoryRoles = new InMemoryRolesRepository(rolesPreset)
        const getRoleUseCase = new GetRoleUseCase(inMemoryRoles)
        const result = getRoleUseCase.execute(3)

        expect(result).resolves.not.toThrow()
        expect(result).resolves.toBeTypeOf("object")
    });

    it('should not be able to get a nonexistent role.', async () => {
        const inMemoryRoles = new InMemoryRolesRepository(rolesPreset);
        const getRoleUseCase = new GetRoleUseCase(inMemoryRoles);
        const result = getRoleUseCase.execute(5);


        expect(result).resolves.empty
        expect(result).resolves.toBe(null)
    })

    it('should not be able to get a role with an roleId that is not of type number.', () => {
        const inMemoryRoles = new InMemoryRolesRepository(rolesPreset);
        const getRoleUseCase = new GetRoleUseCase(inMemoryRoles);
        const result = getRoleUseCase.execute(NaN);

        expect(result).rejects.toThrow();
    })  
})