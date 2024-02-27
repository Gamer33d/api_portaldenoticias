import { InMemoryUserRepository } from "../../repositories/inMemory/InMemoryUserRepository"

import { CreateUserController } from "./CreateUser/CreateUserController"
import { CreateUserUseCase } from "./CreateUser/CreateUserUseCase"

import { UserLoginController } from "./UserLogin/UserLoginController"
import { UserLoginUseCase } from "./UserLogin/UserLoginUseCase"

const userRepository = new InMemoryUserRepository()

/*createUserUseCase*/ 
const createUserUseCase = new CreateUserUseCase(userRepository)
const createUserController = new CreateUserController(createUserUseCase)

/*userLoginUseCase*/ 
const userLoginUseCase = new UserLoginUseCase(userRepository)
const userLoginController = new UserLoginController(userLoginUseCase)


export { createUserController, userLoginController }