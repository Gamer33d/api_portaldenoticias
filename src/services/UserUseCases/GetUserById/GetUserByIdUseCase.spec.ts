import { it, expect, describe } from 'vitest'
import { InMemoryUserRepository } from '../../../repositories/inMemory/InMemoryUserRepository'
import { GetUserByIdUseCase } from './GetUserByIdUseCase'

describe('get user by id', () => {
    it('should be able to get a user by id', async () => {
        const userRepository = new InMemoryUserRepository()
        const getUserByIdUseCase = new GetUserByIdUseCase(userRepository)

        let resp = await userRepository.createUser({
            name: "John Doe",
            email: "whatever@email.com",
            password: "123456",
            roleId: 4
        })

        const result = getUserByIdUseCase.execute(resp.id)
        
        expect(result).resolves.exist
        expect((await result).password).not.exist
    })

    it('should not be able to get a user that does not exist.', async () => {
        const userRepository = new InMemoryUserRepository()
        const getUserByIdUseCase = new GetUserByIdUseCase(userRepository)
        const result = getUserByIdUseCase.execute('aundefinedid')
        
        expect(result).rejects.toThrow('this user does not exist')
    })
})