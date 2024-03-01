import { it, describe, expect } from 'vitest'
import { IRole } from '../../../entities/Roles'
import { GetRoleUseCase } from '../../RolesUseCases/GetRole/GetRoleUseCase'
import { InMemoryRolesRepository } from '../../../repositories/inMemory/InMemoryRolesRepository'
import { InMemoryUserRepository } from '../../../repositories/inMemory/InMemoryUserRepository'
import { EditUserUseCase } from './EditUserUseCase'
import { EditUserPermissions, VerifyRolePermissionsUseCase } from '../../RolesUseCases/VerifyRolePermissions/VerifyRolePermissionsUseCase'

describe('edit a user', () => {
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

    it('should be able for a user to edit themselves.', async () => {
        const userRepository = new InMemoryUserRepository()
        const verifyRolePermission = new VerifyRolePermissionsUseCase(new EditUserPermissions(getRoleUseCase))
        const editUserUseCase = new EditUserUseCase(verifyRolePermission, userRepository)

        let userToBeEdited = await userRepository.createUser({
            name: "John Doe",
            email: "whatever@gmail.com",
            password: '123456',
            avatarUrl: undefined,
            roleId: 4
        })

        const editPayload = {
            email: "thisemailisimportant@gmail.com",
            name: "Jane Doe"
        }

        const result = editUserUseCase.execute(editPayload, userToBeEdited.id, userToBeEdited)
        expect(result).resolves.not.toThrow()
        expect(result).resolves.exist
    })

    it('should be able a user with permission edit other users', async () => {
        const userRepository = new InMemoryUserRepository()
        const verifyRolePermission = new VerifyRolePermissionsUseCase(new EditUserPermissions(getRoleUseCase))
        const editUserUseCase = new EditUserUseCase(verifyRolePermission, userRepository)

        let userToBeEdited = await userRepository.createUser({
            name: "John Doe",
            email: "whatever@gmail.com",
            password: '123456',
            avatarUrl: undefined,
            roleId: 4
        })

        let userEditor = await userRepository.createUser({
            avatarUrl: undefined,
            name: "Moderator",
            email: "toissues@gmail.com",
            password: "averystrongpassword",
            roleId: 2,
        })

        const editPayload = {
            email: "thisemailisimportant@gmail.com",
            name: "Jane Doe"
        }

        const result = editUserUseCase.execute(editPayload, userToBeEdited.id, userEditor)
        expect(result).resolves.not.toThrow()
        expect(result).resolves.exist
    })

    it('should be able for the owner to edit all users', async () => {
        const userRepository = new InMemoryUserRepository()
        const verifyRolePermission = new VerifyRolePermissionsUseCase(new EditUserPermissions(getRoleUseCase))
        const editUserUseCase = new EditUserUseCase(verifyRolePermission, userRepository)

        let userToBeEdited = await userRepository.createUser({
            name: "John Doe",
            email: "whatever@gmail.com",
            password: '123456',
            avatarUrl: undefined,
            roleId: 2
        })

        let userEditor = await userRepository.createUser({
            avatarUrl: undefined,
            name: "Owner",
            email: "owner@gmail.com",
            password: "averyverystrongpassword",
            roleId: 1,
        })

        const editPayload = {
            email: "thisemailisimportant@gmail.com",
            name: "Jane Doe"
        }

        const result = editUserUseCase.execute(editPayload, userToBeEdited.id, userEditor)
        expect(result).resolves.not.toThrow()
        expect(result).resolves.exist
    })

    it('should not be able a user with manage_user permission edit user with * permission', async () => {
        const userRepository = new InMemoryUserRepository()
        const verifyRolePermission = new VerifyRolePermissionsUseCase(new EditUserPermissions(getRoleUseCase))
        const editUserUseCase = new EditUserUseCase(verifyRolePermission, userRepository)

        let userToBeEdited = await userRepository.createUser({
            name: "John Doe",
            email: "whatever@gmail.com",
            password: '123456',
            avatarUrl: undefined,
            roleId: 1
        })

        let userEditor = await userRepository.createUser({
            avatarUrl: undefined,
            name: "Moderator",
            email: "moderator@gmail.com",
            password: "averystrongpassword",
            roleId: 2,
        })

        const editPayload = {
            email: "thisemailisimportant@gmail.com",
            name: "Jane Doe"
        }

        const result = editUserUseCase.execute(editPayload, userToBeEdited.id, userEditor)
        expect(result).rejects.toThrow()
    })

    it('should not be able a user with manage_users permission edit other user with manage_users permission', async () => {
        const userRepository = new InMemoryUserRepository()
        const verifyRolePermission = new VerifyRolePermissionsUseCase(new EditUserPermissions(getRoleUseCase))
        const editUserUseCase = new EditUserUseCase(verifyRolePermission, userRepository)

        let userToBeEdited = await userRepository.createUser({
            name: "John Doe",
            email: "whatever@gmail.com",
            password: '123456',
            avatarUrl: undefined,
            roleId: 2
        })

        let userEditor = await userRepository.createUser({
            avatarUrl: undefined,
            name: "Moderator",
            email: "moderator@gmail.com",
            password: "averystrongpassword",
            roleId: 2,
        })

        const editPayload = {
            email: "thisemailisimportant@gmail.com",
            name: "Jane Doe"
        }

        const result = editUserUseCase.execute(editPayload, userToBeEdited.id, userEditor)
        expect(result).rejects.toThrow()
    })

    it('should not be able a banned user edit themselves', async () => {
        const userRepository = new InMemoryUserRepository()
        const verifyRolePermission = new VerifyRolePermissionsUseCase(new EditUserPermissions(getRoleUseCase))
        const editUserUseCase = new EditUserUseCase(verifyRolePermission, userRepository)

        let user = await userRepository.createUser({
            avatarUrl: undefined,
            name: "Moderator",
            email: "moderator@gmail.com",
            password: "averystrongpassword",
            roleId: 2,
        })

        user.banned = true

        const editPayload = {
            email: "thisemailisimportant@gmail.com",
            name: "Jane Doe"
        }

        const result = editUserUseCase.execute(editPayload, user.id, user)
        expect(result).rejects.toThrow()
    })
    
    it('should not be able a banned user edit some user', async () => {
        const userRepository = new InMemoryUserRepository()
        const verifyRolePermission = new VerifyRolePermissionsUseCase(new EditUserPermissions(getRoleUseCase))
        const editUserUseCase = new EditUserUseCase(verifyRolePermission, userRepository)

        let userToBeEdited = await userRepository.createUser({
            name: "John Doe",
            email: "whatever@gmail.com",
            password: '123456',
            avatarUrl: undefined,
            roleId: 4
        })

        let userEditor = await userRepository.createUser({
            avatarUrl: undefined,
            name: "Moderator",
            email: "moderator@gmail.com",
            password: "averystrongpassword",
            roleId: 2,
        })

        userEditor.banned = true

        const editPayload = {
            email: "thisemailisimportant@gmail.com",
            name: "Jane Doe"
        }

        const result = editUserUseCase.execute(editPayload, userToBeEdited.id, userEditor)
        expect(result).rejects.toThrow()
    })

    it('should not be able for a non-logged-in user to edit other users.', async() => {
        const userRepository = new InMemoryUserRepository()
        const verifyRolePermission = new VerifyRolePermissionsUseCase(new EditUserPermissions(getRoleUseCase))
        const editUserUseCase = new EditUserUseCase(verifyRolePermission, userRepository)

        let userToBeEdited = await userRepository.createUser({
            name: "John Doe",
            email: "whatever@gmail.com",
            password: '123456',
            avatarUrl: undefined,
            roleId: 4
        })

        const editPayload = {
            email: "thisemailisimportant@gmail.com",
            name: "Jane Doe"
        }

        const result = editUserUseCase.execute(editPayload, userToBeEdited.id, undefined)
        expect(result).rejects.toThrow()
    })

    it('should not be able edit a non Owner user edit roleId <= 2', async() => {
        const userRepository = new InMemoryUserRepository()
        const verifyRolePermission = new VerifyRolePermissionsUseCase(new EditUserPermissions(getRoleUseCase))
        const editUserUseCase = new EditUserUseCase(verifyRolePermission, userRepository)

        let userToBeEdited = await userRepository.createUser({
            name: "John Doe",
            email: "whatever@gmail.com",
            password: '123456',
            avatarUrl: undefined,
            roleId: 5
        })

        let userEditor = await userRepository.createUser({
            avatarUrl: undefined,
            name: "Moderator",
            email: "moderator@gmail.com",
            password: "averystrongpassword",
            roleId: 2,
        })

        const editPayload = {
            roleId: 2
        }

        const result = editUserUseCase.execute(editPayload, userToBeEdited.id, userEditor)
        expect(result).rejects.toThrow()
    })
})