import { InMemoryUserRepository } from '../../../src/repositories/inMemory/InMemoryUserRepository'
import { UserLoginUseCase } from '../../../src/services/UserUseCases/UserLogin/UserLoginUseCase'
import bcrypt from 'bcrypt'
import { describe, it, expect } from 'vitest'

describe('to log in', () => {
    it('should be able to log in', async () => {
        const inMemoryUserRepository = new InMemoryUserRepository()
        const userLoginUseCase = new UserLoginUseCase(inMemoryUserRepository)
        await inMemoryUserRepository.createUser({
            name: "John Doe",
            email: "d@gmail.com",
            password: bcrypt.hashSync('123456', 10),
            roleId: 1
        })

        const result = userLoginUseCase.execute({ email: 'd@gmail.com', password: '123456'})

        expect(result).resolves.toBeTypeOf('string')
        expect(result).resolves.not.toThrow()
        
    })

    it('should not be able to log in with incorrect email.', async () => {
        const inMemoryUserRepository = new InMemoryUserRepository()
        const userLoginUseCase = new UserLoginUseCase(inMemoryUserRepository)
        await inMemoryUserRepository.createUser({
            name: "John Doe",
            email: "dal@gmail.com",
            password: bcrypt.hashSync('123456', 10),
            roleId: 1
        })

        const result = userLoginUseCase.execute({ email: 'd@gmail.com', password: '123456'})

        expect(result).rejects.toThrow()
    })

    it('should not be able to log in with incorrect password.', async () => {
        const inMemoryUserRepository = new InMemoryUserRepository()
        const userLoginUseCase = new UserLoginUseCase(inMemoryUserRepository)
        await inMemoryUserRepository.createUser({
            name: "John Doe",
            email: "dal@gmail.com",
            password: bcrypt.hashSync('123456', 10),
            roleId: 1
        })

        const result = userLoginUseCase.execute({ email: 'd@gmail.com', password: '123456'})

        expect(result).rejects.toThrow()
    })
})