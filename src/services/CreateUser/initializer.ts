import { InMemoryUserRepository } from '../../repositories/inMemory/InMemoryUserRepository';
import { CreateUserController } from './CreateUserController';
import { CreateUserUseCase } from './CreateUserUseCase'

const userRepository = new InMemoryUserRepository()
const createUserUseCase = new CreateUserUseCase(userRepository)
const createUserController = new CreateUserController(createUserUseCase)


export { createUserController, createUserUseCase }