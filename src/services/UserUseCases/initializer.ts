import { InMemoryUserRepository } from "../../repositories/inMemory/InMemoryUserRepository"
import { getRoleUseCase } from "../RolesUseCases/initializer"

import { CreateUserController } from "./CreateUser/CreateUserController"
import { CreateUserUseCase } from "./CreateUser/CreateUserUseCase"
import { GetAllUsersController } from "./GetAllUsers/GetAllUsersController"
import { GetAllUsersUseCase } from "./GetAllUsers/GetAllUsersUseCase"
import { GetUserByIdController } from "./GetUserById/GetUserByIdController"
import { GetUserByIdUseCase } from "./GetUserById/GetUserByIdUseCase"
import { EditUserController } from "./UpdateUser/EditUserController"
import { EditUserUseCase } from "./UpdateUser/EditUserUseCase"

import { UserLoginController } from "./UserLogin/UserLoginController"
import { UserLoginUseCase } from "./UserLogin/UserLoginUseCase"

const userRepository = new InMemoryUserRepository()

/*createUser*/ 
const createUserUseCase = new CreateUserUseCase(userRepository)
const createUserController = new CreateUserController(createUserUseCase)

/*userLogin*/ 
const userLoginUseCase = new UserLoginUseCase(userRepository)
const userLoginController = new UserLoginController(userLoginUseCase)

/*editUser */
const editUserUseCase = new EditUserUseCase(getRoleUseCase, userRepository)
const editUserController = new EditUserController(editUserUseCase)

/*getAllUser*/

const getAllUsersUseCase = new GetAllUsersUseCase(userRepository)
const getAllUsersController = new GetAllUsersController(getAllUsersUseCase)

/*getUserByID*/
const getUserByIdUseCase = new GetUserByIdUseCase(userRepository)
const getUserByIdController = new GetUserByIdController(getUserByIdUseCase)

export { createUserController, userLoginController, editUserController, getAllUsersController, getUserByIdController }