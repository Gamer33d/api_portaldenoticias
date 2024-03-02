import { it, describe, expect} from 'vitest'
import { CreateNewsUseCase } from './CreateNewsUseCase'
import { InMemoryNewsRepository } from '../../../repositories/inMemory/InMemoryNewsRepository'
import { GetRoleUseCase } from '../../RolesUseCases/GetRole/GetRoleUseCase'
import { InMemoryRolesRepository } from '../../../repositories/inMemory/InMemoryRolesRepository'
import { IRole } from '../../../entities/Roles'
import { CreateNewsPermissions, VerifyRolePermissionsUseCase } from '../../RolesUseCases/VerifyRolePermissions/VerifyRolePermissionsUseCase'
import { InMemoryUserRepository } from '../../../repositories/inMemory/InMemoryUserRepository'
import { ICreateNewsRequestDTO } from '../../../entities/News'

describe('create a news', async() => {
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
    const verifyRolePermission = new VerifyRolePermissionsUseCase(new CreateNewsPermissions(), getRoleUseCase)

    it('should be able a user with the permission "manage_your_news" to create a news', async() => {
        const userRepository = new InMemoryUserRepository()
        const newsRepository = new InMemoryNewsRepository()
        const createNewsUseCase = new CreateNewsUseCase(newsRepository, verifyRolePermission) 

        const user = await userRepository.createUser({
            name: "John Doe",
            email: "whatever@gmail.com",
            password: "124560",
            roleId: 3
        })

        const newsPayload: ICreateNewsRequestDTO = {
            userId: user.id,
            title: "The JS is amazing!",
            description: "A brief description of the Javascript Language",
            content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur tincidunt tincidunt velit. Nunc vel feugiat dui, nec rutrum tortor. Ut eleifend erat mi, ut interdum velit egestas sit amet. Morbi tempus hendrerit molestie. Quisque neque felis, fermentum et lectus quis, efficitur mollis ex. Duis vulputate arcu et dolor viverra accumsan porta in nisi. Proin in ultrices magna, in consectetur sapien. Proin vitae nibh mi. Nunc vitae leo faucibus, porta risus eget, commodo ligula. Ut interdum mauris ut laoreet facilisis. Aliquam semper posuere bibendum. Etiam et lobortis justo."           
        }

        const result = createNewsUseCase.execute(newsPayload, user)
        expect(result).resolves.exist
        expect(result).resolves.toBeTypeOf('object')
    })

    it('should be able a user with the permission "manage_all_news" to create a news', async() => {
        const userRepository = new InMemoryUserRepository()
        const newsRepository = new InMemoryNewsRepository()
        const createNewsUseCase = new CreateNewsUseCase(newsRepository, verifyRolePermission) 

        const user = await userRepository.createUser({
            name: "John Doe",
            email: "whatever@gmail.com",
            password: "124560",
            roleId: 2
        })

        const newsPayload: ICreateNewsRequestDTO = {
            userId: user.id,
            title: "The JS is amazing!",
            description: "A brief description of the Javascript Language",
            content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur tincidunt tincidunt velit. Nunc vel feugiat dui, nec rutrum tortor. Ut eleifend erat mi, ut interdum velit egestas sit amet. Morbi tempus hendrerit molestie. Quisque neque felis, fermentum et lectus quis, efficitur mollis ex. Duis vulputate arcu et dolor viverra accumsan porta in nisi. Proin in ultrices magna, in consectetur sapien. Proin vitae nibh mi. Nunc vitae leo faucibus, porta risus eget, commodo ligula. Ut interdum mauris ut laoreet facilisis. Aliquam semper posuere bibendum. Etiam et lobortis justo."           
        }

        const result = createNewsUseCase.execute(newsPayload, user)
        expect(result).resolves.exist
        expect(result).resolves.toBeTypeOf('object')
    })

    it('should not be able a user without the permission "manage_news" or "manage_all_news" or "*" to create a news', async() => {
        const userRepository = new InMemoryUserRepository()
        const newsRepository = new InMemoryNewsRepository()
        const createNewsUseCase = new CreateNewsUseCase(newsRepository, verifyRolePermission) 

        const user = await userRepository.createUser({
            name: "John Doe",
            email: "whatever@gmail.com",
            password: "124560",
            roleId: 4
        })

        const newsPayload: ICreateNewsRequestDTO = {
            userId: user.id,
            title: "The JS is amazing!",
            description: "A brief description of the Javascript Language",
            content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur tincidunt tincidunt velit. Nunc vel feugiat dui, nec rutrum tortor. Ut eleifend erat mi, ut interdum velit egestas sit amet. Morbi tempus hendrerit molestie. Quisque neque felis, fermentum et lectus quis, efficitur mollis ex. Duis vulputate arcu et dolor viverra accumsan porta in nisi. Proin in ultrices magna, in consectetur sapien. Proin vitae nibh mi. Nunc vitae leo faucibus, porta risus eget, commodo ligula. Ut interdum mauris ut laoreet facilisis. Aliquam semper posuere bibendum. Etiam et lobortis justo."           
        }

        const result = createNewsUseCase.execute(newsPayload, user)
        expect(result).rejects.exist
        expect(result).rejects.toThrow('you dont have permission to create a news')
    })

    it('should not be able a banned user to create a news', async() => {
        const userRepository = new InMemoryUserRepository()
        const newsRepository = new InMemoryNewsRepository()
        const createNewsUseCase = new CreateNewsUseCase(newsRepository, verifyRolePermission) 

        const user = await userRepository.createUser({
            name: "John Doe",
            email: "whatever@gmail.com",
            password: "124560",
            roleId: 3
        })

        user.banned = true

        const newsPayload: ICreateNewsRequestDTO = {
            userId: user.id,
            title: "The JS is amazing!",
            description: "A brief description of the Javascript Language",
            content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur tincidunt tincidunt velit. Nunc vel feugiat dui, nec rutrum tortor. Ut eleifend erat mi, ut interdum velit egestas sit amet. Morbi tempus hendrerit molestie. Quisque neque felis, fermentum et lectus quis, efficitur mollis ex. Duis vulputate arcu et dolor viverra accumsan porta in nisi. Proin in ultrices magna, in consectetur sapien. Proin vitae nibh mi. Nunc vitae leo faucibus, porta risus eget, commodo ligula. Ut interdum mauris ut laoreet facilisis. Aliquam semper posuere bibendum. Etiam et lobortis justo."           
        }

        const result = createNewsUseCase.execute(newsPayload, user)
        expect(result).rejects.exist
        expect(result).rejects.toThrow('you dont have permission to create a news (banned)')
    })

    it('should not be able a user non logged create a news', async () => {
        const newsRepository = new InMemoryNewsRepository()
        const createNewsUseCase = new CreateNewsUseCase(newsRepository, verifyRolePermission) 

        const newsPayload: ICreateNewsRequestDTO = {
            userId: '1',
            title: "The JS is amazing!",
            description: "A brief description of the Javascript Language",
            content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur tincidunt tincidunt velit. Nunc vel feugiat dui, nec rutrum tortor. Ut eleifend erat mi, ut interdum velit egestas sit amet. Morbi tempus hendrerit molestie. Quisque neque felis, fermentum et lectus quis, efficitur mollis ex. Duis vulputate arcu et dolor viverra accumsan porta in nisi. Proin in ultrices magna, in consectetur sapien. Proin vitae nibh mi. Nunc vitae leo faucibus, porta risus eget, commodo ligula. Ut interdum mauris ut laoreet facilisis. Aliquam semper posuere bibendum. Etiam et lobortis justo."           
        }

        const result = createNewsUseCase.execute(newsPayload, undefined)
        expect(result).rejects.exist
        expect(result).rejects.toThrow('you must be logged to create any news')
    })

    it('should not be able create a news with description caracters > 180', async() => {
        const userRepository = new InMemoryUserRepository()
        const newsRepository = new InMemoryNewsRepository()
        const createNewsUseCase = new CreateNewsUseCase(newsRepository, verifyRolePermission) 

        const user = await userRepository.createUser({
            name: "John Doe",
            email: "whatever@gmail.com",
            password: "124560",
            roleId: 3
        })

        const newsPayload: ICreateNewsRequestDTO = {
            userId: user.id,
            title: "The JS is amazing!",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean lectus nulla, volutpat non erat id, malesuada viverra ipsum. Aenean nec volutpat lacus. Sed quis tempus augue. Aenean erat sapien,",
            content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur tincidunt tincidunt velit. Nunc vel feugiat dui, nec rutrum tortor. Ut eleifend erat mi, ut interdum velit egestas sit amet. Morbi tempus hendrerit molestie. Quisque neque felis, fermentum et lectus quis, efficitur mollis ex. Duis vulputate arcu et dolor viverra accumsan porta in nisi. Proin in ultrices magna, in consectetur sapien. Proin vitae nibh mi. Nunc vitae leo faucibus, porta risus eget, commodo ligula. Ut interdum mauris ut laoreet facilisis. Aliquam semper posuere bibendum. Etiam et lobortis justo."           
        }

        const result = createNewsUseCase.execute(newsPayload, user)
        expect(result).rejects.toThrow('the maximum value of characters in description is 180. The value provided was exceeded')
    })
    it('should not be able create a news with title caracters > 60', async() => {
        const userRepository = new InMemoryUserRepository()
        const newsRepository = new InMemoryNewsRepository()
        const createNewsUseCase = new CreateNewsUseCase(newsRepository, verifyRolePermission) 

        const user = await userRepository.createUser({
            name: "John Doe",
            email: "whatever@gmail.com",
            password: "124560",
            roleId: 3
        })

        const newsPayload: ICreateNewsRequestDTO = {
            userId: user.id,
            title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. abcd",
            description: "An amazing description",
            content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur tincidunt tincidunt velit. Nunc vel feugiat dui, nec rutrum tortor. Ut eleifend erat mi, ut interdum velit egestas sit amet. Morbi tempus hendrerit molestie. Quisque neque felis, fermentum et lectus quis, efficitur mollis ex. Duis vulputate arcu et dolor viverra accumsan porta in nisi. Proin in ultrices magna, in consectetur sapien. Proin vitae nibh mi. Nunc vitae leo faucibus, porta risus eget, commodo ligula. Ut interdum mauris ut laoreet facilisis. Aliquam semper posuere bibendum. Etiam et lobortis justo."           
        }

        const result = createNewsUseCase.execute(newsPayload, user)
        expect(result).rejects.toThrow('the maximum value of characters in title is 60. The value provided was exceeded')
    })
}) 