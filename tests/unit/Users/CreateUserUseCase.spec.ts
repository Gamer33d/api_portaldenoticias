import { CreateUserUseCase } from '../../../src/services/UserUseCases/CreateUser/CreateUserUseCase'
import { InMemoryUserRepository } from '../../../src/repositories/inMemory/InMemoryUserRepository'
import { describe, it, expect } from 'vitest'
describe('create a user', () => {
    it('should to be able create a user', async () => {
        const createUserUseCase = new CreateUserUseCase(new InMemoryUserRepository())
        const user = await createUserUseCase.execute({
            name: "John Doe",
            email: "whatever@email.com",
            password: "123",
            roleId: undefined
        }, undefined)

        expect(user.id).toBeDefined()
    })

    it('should to be not able create two users with the same name', async () => {
        const createUserUseCase = new CreateUserUseCase(new InMemoryUserRepository())
        await createUserUseCase.execute({
            name: "John Doe",
            email: "whathever@gmail.com",
            password: "0520",
            roleId: undefined
        }, undefined)

        const resultPromise = createUserUseCase.execute({
            name: "John Doe",
            email: "whathever2@gmail.com",
            password: "0520",
            roleId: undefined
        }, undefined)

        expect(resultPromise).rejects.toThrow()
    })

    it('should to be not able create two users with the same email', async () => {
        const createUserUseCase = new CreateUserUseCase(new InMemoryUserRepository())
        await createUserUseCase.execute({
            name: "John Doe2",
            email: "whathever@gmail.com",
            password: "0520",
            roleId: undefined
        }, undefined)

        const resultPromise = createUserUseCase.execute({
            name: "John Doe",
            email: "whathever@gmail.com",
            password: "0520",
            roleId: undefined
        }, undefined)

        expect(resultPromise).rejects.toThrow()
    })

    it('should to be not able create a user with roleId <= 3 if you are not logged in', async () => {
        const createUserUseCase = new CreateUserUseCase(new InMemoryUserRepository())
        const resultPromise = createUserUseCase.execute({
            name: "John Doe",
            email: "whatever@email.com",
            password: "12346",
            roleId: 2
        }, undefined)

        expect(resultPromise).rejects.toThrow()
    })

    it('should to be not able create a user with roleId <=3 if the user logged dont has permission', async () => {
        const createUserUseCase = new CreateUserUseCase(new InMemoryUserRepository())

        const resultPromise = createUserUseCase.execute({
            name: "John Doe",
            email: "whatever@email.com",
            password: "12346",
            roleId: 2
        }, {
            id: '1',
            name: "adminFake",
            email: "dsadasd@g.com",
            banned: false,
            roleId: 2,
            avatarUrl: null
        })

        expect(resultPromise).rejects.toThrow()
    })

    it("should to be not able create a user if the user logged has banned", async () => {
        const createUserUseCase = new CreateUserUseCase(new InMemoryUserRepository())

        const resultPromise = createUserUseCase.execute({
            name: "John Doe",
            email: "whatever@email.com",
            password: "12346",
            roleId: 2
        }, {
            id: '1',
            name: "adminFake",
            email: "dsadasd@g.com",
            banned: true,
            roleId: 2
        })

        expect(resultPromise).rejects.toThrow()
    })
})     