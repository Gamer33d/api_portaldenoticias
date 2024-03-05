import { IRole } from '../../../src/entities/Roles'
import { IUser } from '../../../src/entities/User'
import { InMemoryRolesRepository } from '../../../src/repositories/inMemory/InMemoryRolesRepository'
import { DeleteUserUseCase } from '../../../src/services/UserUseCases/DeleteUser/DeleteUserUseCase'
import { InMemoryUserRepository } from '../../../src/repositories/inMemory/InMemoryUserRepository'
import { GetRoleUseCase } from '../../../src/services/RolesUseCases/GetRole/GetRoleUseCase'
import { VerifyRolePermissionsUseCase, DeleteUserPermissions } from '../../../src/services/RolesUseCases/VerifyRolePermissions/VerifyRolePermissionsUseCase'
import { describe, it, expect } from 'vitest'

describe('delete a user', () => {
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
    const getRoleUseCase = new GetRoleUseCase(rolesRepository)
    const verifyRolePermissionsUseCase = new VerifyRolePermissionsUseCase(new DeleteUserPermissions(), getRoleUseCase)
    it('should be able for a user to delete themselves.', async () => {
        const userRepository = new InMemoryUserRepository()
        const deleteUserUseCase = new DeleteUserUseCase(userRepository, verifyRolePermissionsUseCase)

        let userToBeDeleted = await userRepository.createUser({
            name: "John Doe",
            email: "whatever@gmail.com",
            password: '123456',
            avatarUrl: undefined,
            roleId: 4
        })

        const result = deleteUserUseCase.execute(userToBeDeleted.id, userToBeDeleted)
        expect(result).resolves.not.toThrow()
        expect(result).resolves.exist
    })

    it('should be able for a user with permission * delete any users', async() => {
        const userRepository = new InMemoryUserRepository()
        const deleteUserUseCase = new DeleteUserUseCase(userRepository, verifyRolePermissionsUseCase)

        let userToBeDeleted = await userRepository.createUser({
            name: "John Doe",
            email: "whatever@gmail.com",
            password: '123456',
            avatarUrl: undefined,
            roleId: 2
        })

        let userLogged: IUser = {
            name: "THE Owner",
            email: "thisemailisveryimportant@gmail.com",
            roleId: 1,
            banned: false,
            id: '1'
        }

        const result = deleteUserUseCase.execute(userToBeDeleted.id, userLogged)
        expect(result).resolves.not.toThrow()
        expect(result).resolves.exist
    })

    it('should be able for a user with permission "manage_users" delete any users without permission "*"', async() => {
        const userRepository = new InMemoryUserRepository()
        const deleteUserUseCase = new DeleteUserUseCase(userRepository, verifyRolePermissionsUseCase)

        let userToBeDeleted = await userRepository.createUser({
            name: "John Doe",
            email: "whatever@gmail.com",
            password: '123456',
            avatarUrl: undefined,
            roleId: 3
        })

        let userLogged: IUser = {
            name: "THE Moderator",
            email: "thisemailisveryimportant@gmail.com",
            roleId: 2,
            banned: false,
            id: '1'
        }

        const result = deleteUserUseCase.execute(userToBeDeleted.id, userLogged)
        expect(result).resolves.not.toThrow()
        expect(result).resolves.exist
    })
    
    it('should not be able for a user with permission "manage_users" delete a user with permission "*"', async() => {
        const userRepository = new InMemoryUserRepository()
        const deleteUserUseCase = new DeleteUserUseCase(userRepository, verifyRolePermissionsUseCase)

        let userToBeDeleted = await userRepository.createUser({
            name: "John Doe",
            email: "whatever@gmail.com",
            password: '123456',
            avatarUrl: undefined,
            roleId: 1
        })

        let userLogged: IUser = {
            name: "THE Moderator",
            email: "thisemailisveryimportant@gmail.com",
            roleId: 2,
            banned: false,
            id: '1'
        }

        const result = deleteUserUseCase.execute(userToBeDeleted.id, userLogged)
        expect(result).rejects.toThrow('you dont have permission to delete this user')
        expect(result).rejects.exist
    })

    it('should not be able for a user with permission "manage_users" delete a user with permission "manage_users"', async() => {
        const userRepository = new InMemoryUserRepository()
        const deleteUserUseCase = new DeleteUserUseCase(userRepository, verifyRolePermissionsUseCase)

        let userToBeDeleted = await userRepository.createUser({
            name: "John Doe",
            email: "whatever@gmail.com",
            password: '123456',
            avatarUrl: undefined,
            roleId: 2
        })

        let userLogged: IUser = {
            name: "THE Moderator",
            email: "thisemailisveryimportant@gmail.com",
            roleId: 2,
            banned: false,
            id: '1'
        }

        const result = deleteUserUseCase.execute(userToBeDeleted.id, userLogged)
        expect(result).rejects.toThrow('you dont have permission to delete this user')
        expect(result).rejects.exist
    })

    it('should not be able for a banned user delete themselves', async() => {
        const userRepository = new InMemoryUserRepository()
        const deleteUserUseCase = new DeleteUserUseCase(userRepository, verifyRolePermissionsUseCase)

        let userToBeDeleted = await userRepository.createUser({
            name: "John Doe",
            email: "whatever@gmail.com",
            password: '123456',
            avatarUrl: undefined,
            roleId: 2
        })

        userToBeDeleted.banned = true

        const result = deleteUserUseCase.execute(userToBeDeleted.id, userToBeDeleted)
        expect(result).rejects.toThrow('you dont have permission to delete this user')
        expect(result).rejects.exist
    })

    it('should not be able for a banned user delete other users', async() => {
        const userRepository = new InMemoryUserRepository()
        const deleteUserUseCase = new DeleteUserUseCase(userRepository, verifyRolePermissionsUseCase)

        let userToBeDeleted = await userRepository.createUser({
            name: "John Doe",
            email: "whatever@gmail.com",
            password: '123456',
            avatarUrl: undefined,
            roleId: 5 
        })

        let userLogged: IUser = {
            name: "THE Moderator",
            email: "thisemailisveryimportant@gmail.com",
            roleId: 2,
            banned: true,
            id: '1'
        }

        const result = deleteUserUseCase.execute(userToBeDeleted.id, userLogged)
        expect(result).rejects.toThrow('you dont have permission to delete this user')
        expect(result).rejects.exist
    })
    
    it('should not be able for a non-logged user delete any user', async() => {
        const userRepository = new InMemoryUserRepository()
        const deleteUserUseCase = new DeleteUserUseCase(userRepository, verifyRolePermissionsUseCase)

        let userToBeDeleted = await userRepository.createUser({
            name: "John Doe",
            email: "whatever@gmail.com",
            password: '123456',
            avatarUrl: undefined,
            roleId: 5 
        })


        const result = deleteUserUseCase.execute(userToBeDeleted.id, undefined)
        expect(result).rejects.toThrow('you must be logged to delete any user')
        expect(result).rejects.exist
    })

})