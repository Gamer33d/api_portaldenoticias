import { describe, it, expect } from 'vitest'
import { InMemoryRolesRepository } from '../../../repositories/inMemory/InMemoryRolesRepository'
import { GetRoleUseCase } from '../../RolesUseCases/GetRole/GetRoleUseCase'
import { IRole } from '../../../entities/Roles'
import { EditNewsPermissions, VerifyRolePermissionsUseCase } from '../../RolesUseCases/VerifyRolePermissions/VerifyRolePermissionsUseCase'
import { InMemoryNewsRepository } from '../../../repositories/inMemory/InMemoryNewsRepository'
import { EditNewsUseCase } from './EditNewsUseCase'
import { IUser } from '../../../entities/User'
import { IEditNewsRequestDTO } from '../../../entities/News'

describe('edit a news', async () => {
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
    const verifyRolePermissions = new VerifyRolePermissionsUseCase(new EditNewsPermissions(), getRoleUseCase)

    it('should be able to edit a news', async () => {
        const newsRepository = new InMemoryNewsRepository()
        const editNewsUseCase = new EditNewsUseCase(newsRepository, verifyRolePermissions)

        const newsToEdit = await newsRepository.createNews({
            title: "a amazing news",
            description: "the best description",
            content: "the top one content of year",
            userId: '1'
        })

        const editPayload: IEditNewsRequestDTO = {
            title: "the best news of the world!",
        }

        const userLogged: IUser = {
            id: '1',
            name: "John Doe",
            email: "whatever@gmail.com",
            password: "123456",
            banned: false,
            roleId: 3
        }

        const result = editNewsUseCase.execute(newsToEdit.id, editPayload, userLogged)
        expect(result).resolves.exist
        expect(result).resolves.not.toThrow()
    })

    it('should be able a user with permission "manage_all_news" to edit any news', async () => {
        const newsRepository = new InMemoryNewsRepository()
        const editNewsUseCase = new EditNewsUseCase(newsRepository, verifyRolePermissions)

        const newsToEdit = await newsRepository.createNews({
            title: "a amazing news",
            description: "the best description",
            content: "the top one content of year",
            userId: '2'
        })

        const editPayload: IEditNewsRequestDTO = {
            title: "the best news of the world!"
        }

        const userLogged: IUser = {
            id: '1',
            name: "John Doe",
            email: "whatever@gmail.com",
            password: "123456",
            banned: false,
            roleId: 2
        }

        const result = editNewsUseCase.execute(newsToEdit.id, editPayload, userLogged)
        expect(result).resolves.exist
        expect(result).resolves.not.toThrow()
    })

    it('should be able a user with permission "*" to edit any news', async () => {
        const newsRepository = new InMemoryNewsRepository()
        const editNewsUseCase = new EditNewsUseCase(newsRepository, verifyRolePermissions)

        const newsToEdit = await newsRepository.createNews({
            title: "a amazing news",
            description: "the best description",
            content: "the top one content of year",
            userId: '2'
        })

        const editPayload: IEditNewsRequestDTO = {
            title: "the best news of the world!"
        }

        const userLogged: IUser = {
            id: '1',
            name: "John Doe",
            email: "whatever@gmail.com",
            password: "123456",
            banned: false,
            roleId: 1
        }

        const result = editNewsUseCase.execute(newsToEdit.id, editPayload, userLogged)
        expect(result).resolves.exist
        expect(result).resolves.not.toThrow()
    })

    it('should not be able a user without permissions to edit any news', async() => {
        const newsRepository = new InMemoryNewsRepository()
        const editNewsUseCase = new EditNewsUseCase(newsRepository, verifyRolePermissions)

        const newsToEdit = await newsRepository.createNews({
            title: "a amazing news",
            description: "the best description",
            content: "the top one content of year",
            userId: '2'
        })

        const editPayload: IEditNewsRequestDTO = {
            title: "the best news of the world!"
        }

        const userLogged: IUser = {
            id: '1',
            name: "John Doe",
            email: "whatever@gmail.com",
            password: "123456",
            banned: false,
            roleId: 5
        }

        const result = editNewsUseCase.execute(newsToEdit.id, editPayload, userLogged)
        expect(result).rejects
        expect(result).rejects.toThrow('you dont have permission to edit this news')
    })

    it('should not be able create a news with description caracters > 180', async () => {
        const newsRepository = new InMemoryNewsRepository()
        const editNewsUseCase = new EditNewsUseCase(newsRepository, verifyRolePermissions)

        const newsToEdit = await newsRepository.createNews({
            title: "a amazing news",
            description: "the best description",
            content: "the top one content of year",
            userId: '2'
        })

        const editPayload: IEditNewsRequestDTO = {
            description: " Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque eget sapien tempus, consectetur massa ut, varius erat. Etiam molestie eget odio ac mollis. Aliquam elementum, nulla id "
        }

        const userLogged: IUser = {
            id: '1',
            name: "John Doe",
            email: "whatever@gmail.com",
            password: "123456",
            banned: false,
            roleId: 5
        }

        const result = editNewsUseCase.execute(newsToEdit.id, editPayload, userLogged)
        expect(result).rejects
        expect(result).rejects.toThrow('the maximum value of characters in description is 180. The value provided was exceeded')
    })

    it('should not be able create a news with title caracters > 60', async () => {
        const newsRepository = new InMemoryNewsRepository()
        const editNewsUseCase = new EditNewsUseCase(newsRepository, verifyRolePermissions)

        const newsToEdit = await newsRepository.createNews({
            title: "a amazing news",
            description: "the best description",
            content: "the top one content of year",
            userId: '2'
        })

        const editPayload: IEditNewsRequestDTO = {
            title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. QuiLorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque eget sapien tempus, consectetur massa ut, varius erat. Etiam molestie eget odio ac mollis. Aliquam elementum, nulla id "
        }

        const userLogged: IUser = {
            id: '1',
            name: "John Doe",
            email: "whatever@gmail.com",
            password: "123456",
            banned: false,
            roleId: 5
        }

        const result = editNewsUseCase.execute(newsToEdit.id, editPayload, userLogged)
        expect(result).rejects
        expect(result).rejects.toThrow('the maximum value of characters in title is 60. The value provided was exceeded')
    })

    it('should not be able a non logged user to edit any news', async() => {
        const newsRepository = new InMemoryNewsRepository()
        const editNewsUseCase = new EditNewsUseCase(newsRepository, verifyRolePermissions)

        const newsToEdit = await newsRepository.createNews({
            title: "a amazing news",
            description: "the best description",
            content: "the top one content of year",
            userId: '2'
        })

        const editPayload: IEditNewsRequestDTO = {
            title: "the best news of the world!"
        }


        const result = editNewsUseCase.execute(newsToEdit.id, editPayload, undefined)
        expect(result).rejects
        expect(result).rejects.toThrow('you must be logged to edit any news')
    })

    it('should not be able a banned user to edit any news', async() => {
        const newsRepository = new InMemoryNewsRepository()
        const editNewsUseCase = new EditNewsUseCase(newsRepository, verifyRolePermissions)

        const newsToEdit = await newsRepository.createNews({
            title: "a amazing news",
            description: "the best description",
            content: "the top one content of year",
            userId: '2'
        })

        const editPayload: IEditNewsRequestDTO = {
            title: "the best news of the world!"
        }

        const userLogged: IUser = {
            id: '1',
            name: "John Doe",
            email: "whatever@gmail.com",
            password: "123456",
            banned: true,
            roleId: 5
        }

        const result = editNewsUseCase.execute(newsToEdit.id, editPayload, userLogged)
        expect(result).rejects
        expect(result).rejects.toThrow('you dont have permission to edit this news')
    })
})