import { InMemoryUserRepository } from "../../repositories/inMemory/InMemoryUserRepository"
import { getRoleUseCase } from "../RolesUseCases/initializer"

import { CreateUserController } from "./CreateUser/CreateUserController"
import { CreateUserUseCase } from "./CreateUser/CreateUserUseCase"
import { DeleteUserController } from "./DeleteUser/DeleteUserController"
import { DeleteUserUseCase } from "./DeleteUser/DeleteUserUseCase"
import { GetAllUsersController } from "./GetAllUsers/GetAllUsersController"
import { GetAllUsersUseCase } from "./GetAllUsers/GetAllUsersUseCase"
import { GetUserByEmailController } from "./GetUserByEmail/GetUserByEmailController"
import { GetUserByEmailUseCase } from "./GetUserByEmail/GetUserByEmailUseCase"
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

/*getUserByEmail*/
const getUserByEmailUseCase = new GetUserByEmailUseCase(userRepository)
const getUserByEmailController = new GetUserByEmailController(getUserByEmailUseCase)

/*deleteUser*/
const deleteUserUseCase = new DeleteUserUseCase(getRoleUseCase, userRepository)
const deleteUserController = new DeleteUserController(deleteUserUseCase)

export { createUserController, userLoginController, editUserController, getAllUsersController, getUserByEmailController, deleteUserController }