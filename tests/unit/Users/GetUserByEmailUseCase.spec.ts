import { InMemoryUserRepository } from '../../../src/repositories/inMemory/InMemoryUserRepository'
import { GetUserByEmailUseCase } from '../../../src/services/UserUseCases/GetUserByEmail/GetUserByEmailUseCase'
import { describe, it, expect } from 'vitest'

describe('get user by id', () => {
    it('should be able to get a user by email', async () => {
        const userRepository = new InMemoryUserRepository()
        const getUserByIdUseCase = new GetUserByEmailUseCase(userRepository)

        let resp = await userRepository.createUser({
            name: "John Doe",
            email: "whatever@email.com",
            password: "123456",
            roleId: 4
        })

        const result = getUserByIdUseCase.execute(resp.email)
        
        expect(result).resolves.exist
        expect((await result).password).not.exist
    })

    it('should not be able to get a user that does not exist.', async () => {
        const userRepository = new InMemoryUserRepository()
        const getUserByIdUseCase = new GetUserByEmailUseCase(userRepository)
        const result = getUserByIdUseCase.execute('aundefinedemail')
        
        expect(result).rejects.toThrow('this user does not exist')
    })
})