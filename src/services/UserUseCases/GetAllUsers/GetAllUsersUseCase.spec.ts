import { describe, it, expect } from 'vitest'
import { GetAllUsersUseCase } from './GetAllUsersUseCase'
import { InMemoryUserRepository } from '../../../repositories/inMemory/InMemoryUserRepository'
describe('get all users', () => {
    it('should be able to get all users', async () => {
        const userRepository = new InMemoryUserRepository()
        const getAllUsersUseCase = new GetAllUsersUseCase(userRepository)

        for (let i = 0; i < 5; i++) {
            await userRepository.createUser({
                name: `John Doe${i}`,
                email: `whatever${i}@gmail.com`,
                password: '123456',
                roleId: 4
            })
        }

        const result = getAllUsersUseCase.execute()
        expect(result).resolves.toBeTypeOf('object')
        expect((await result)[0].password).not.exist
    })
})