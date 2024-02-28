import { InMemoryUserRepository } from "../../repositories/inMemory/InMemoryUserRepository"
import { getRoleUseCase } from "../RolesUseCases/initializer"

import { CreateUserController } from "./CreateUser/CreateUserController"
import { CreateUserUseCase } from "./CreateUser/CreateUserUseCase"
import { EditUserController } from "./UpdateUser/EditUserController"
import { EditUserUseCase } from "./UpdateUser/EditUserUseCase"

import { UserLoginController } from "./UserLogin/UserLoginController"
import { UserLoginUseCase } from "./UserLogin/UserLoginUseCase"

const userRepository = new InMemoryUserRepository()

/*createUserUseCase*/ 
const createUserUseCase = new CreateUserUseCase(userRepository)
const createUserController = new CreateUserController(createUserUseCase)

/*userLoginUseCase*/ 
const userLoginUseCase = new UserLoginUseCase(userRepository)
const userLoginController = new UserLoginController(userLoginUseCase)

/*editUserUseCase */
const editUserUseCase = new EditUserUseCase(getRoleUseCase, userRepository)
const editUserController = new EditUserController(editUserUseCase)


export { createUserController, userLoginController, editUserController }