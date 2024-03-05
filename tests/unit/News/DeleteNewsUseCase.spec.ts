import { IRole } from '../../../src/entities/Roles'
import { IUser } from '../../../src/entities/User'
import { InMemoryNewsRepository } from '../../../src/repositories/inMemory/InMemoryNewsRepository'
import { InMemoryRolesRepository } from '../../../src/repositories/inMemory/InMemoryRolesRepository'
import { DeleteNewsUseCase } from '../../../src/services/NewsUseCases/DeleteNews/DeleteNewsUseCase'
import { GetRoleUseCase } from '../../../src/services/RolesUseCases/GetRole/GetRoleUseCase'
import { VerifyRolePermissionsUseCase, DeleteNewsPermissions } from '../../../src/services/RolesUseCases/VerifyRolePermissions/VerifyRolePermissionsUseCase'
import { describe, it, expect } from 'vitest'


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
    const verifyRolePermissions = new VerifyRolePermissionsUseCase(new DeleteNewsPermissions(), getRoleUseCase)

    it('should be able a user to delete a your news', async () => {
        const newsRepository = new InMemoryNewsRepository()
        const deleteNewsUseCase = new DeleteNewsUseCase(newsRepository, verifyRolePermissions)

        const newsToDelete = await newsRepository.createNews({
            title: "a test news",
            description: "this news is a test",
            content: "this news is a great test",
            userId: '123456'
        })
        
        const userLogged: IUser = {
            id: '123456',
            name: 'John Doe',
            email: "whaterver@gmail.com",
            banned: false,
            roleId: 3
        }

        const result = deleteNewsUseCase.execute(newsToDelete.id, userLogged)
        expect(result).resolves.exist
        expect(result).resolves.toBeTruthy()
    })

    it('should be able a user with permission "manage_all_news" delete any news.', async () => {
        const newsRepository = new InMemoryNewsRepository()
        const deleteNewsUseCase = new DeleteNewsUseCase(newsRepository, verifyRolePermissions)

        const newsToDelete = await newsRepository.createNews({
            title: "a test news",
            description: "this news is a test",
            content: "this news is a great test",
            userId: '123456'
        })
        
        const userLogged: IUser = {
            id: '551',
            name: 'John Doe',
            email: "whaterver@gmail.com",
            banned: false,
            roleId: 2
        }

        const result = deleteNewsUseCase.execute(newsToDelete.id, userLogged)
        expect(result).resolves.exist
        expect(result).resolves.toBeTruthy()
    })

    it('should be able a user with permission "*" delete any news.', async () => {
        const newsRepository = new InMemoryNewsRepository()
        const deleteNewsUseCase = new DeleteNewsUseCase(newsRepository, verifyRolePermissions)

        const newsToDelete = await newsRepository.createNews({
            title: "a test news",
            description: "this news is a test",
            content: "this news is a great test",
            userId: '123456'
        })
        
        const userLogged: IUser = {
            id: '551',
            name: 'John Doe',
            email: "whaterver@gmail.com",
            banned: false,
            roleId: 1
        }

        const result = deleteNewsUseCase.execute(newsToDelete.id, userLogged)
        expect(result).resolves.exist
        expect(result).resolves.toBeTruthy()
    })

    it('should not be able a user without permissions to delete any news', async () => {
        const newsRepository = new InMemoryNewsRepository()
        const deleteNewsUseCase = new DeleteNewsUseCase(newsRepository, verifyRolePermissions)

        const newsToDelete = await newsRepository.createNews({
            title: "a test news",
            description: "this news is a test",
            content: "this news is a great test",
            userId: '123456'
        })
        
        const userLogged: IUser = {
            id: '123456',
            name: 'John Doe',
            email: "whaterver@gmail.com",
            banned: false,
            roleId: 5
        }

        const result = deleteNewsUseCase.execute(newsToDelete.id, userLogged)
        expect(result).rejects.toThrow("you dont have permission to delete this news")
    })
    it('should not be able a non logged user to delete any news', async () => {
        const newsRepository = new InMemoryNewsRepository()
        const deleteNewsUseCase = new DeleteNewsUseCase(newsRepository, verifyRolePermissions)

        const newsToDelete = await newsRepository.createNews({
            title: "a test news",
            description: "this news is a test",
            content: "this news is a great test",
            userId: '123456'
        })
        
        const result = deleteNewsUseCase.execute(newsToDelete.id, undefined)
        expect(result).rejects.toThrow("you must be logged to delete any news")
    })
    it('should not be able a banned user to delete any news', async () => {
        const newsRepository = new InMemoryNewsRepository()
        const deleteNewsUseCase = new DeleteNewsUseCase(newsRepository, verifyRolePermissions)

        const newsToDelete = await newsRepository.createNews({
            title: "a test news",
            description: "this news is a test",
            content: "this news is a great test",
            userId: '123456'
        })

        const userLogged: IUser = {
            id: '123456',
            name: 'John Doe',
            email: "whaterver@gmail.com",
            banned: true,
            roleId: 5
        }
        
        const result = deleteNewsUseCase.execute(newsToDelete.id, userLogged)
        expect(result).rejects.toThrow("you dont have permission to delete this news")
    })


})