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
import { EditUserController } from "./EditUser/EditUserController"
import { EditUserUseCase } from "./EditUser/EditUserUseCase"

import { UserLoginController } from "./UserLogin/UserLoginController"
import { UserLoginUseCase } from "./UserLogin/UserLoginUseCase"
import { DeleteUserPermissions, EditUserPermissions, VerifyRolePermissionsUseCase } from "../RolesUseCases/VerifyRolePermissions/VerifyRolePermissionsUseCase"

const userRepository = new InMemoryUserRepository()

/*createUser*/
const createUserUseCase = new CreateUserUseCase(userRepository)
const createUserController = new CreateUserController(createUserUseCase)

/*userLogin*/
const userLoginUseCase = new UserLoginUseCase(userRepository)
const userLoginController = new UserLoginController(userLoginUseCase)

/*editUser */
const verifyEditRolePermission = new VerifyRolePermissionsUseCase(new EditUserPermissions(getRoleUseCase))
const editUserUseCase = new EditUserUseCase(verifyEditRolePermission, userRepository)
const editUserController = new EditUserController(editUserUseCase)

/*getAllUser*/

const getAllUsersUseCase = new GetAllUsersUseCase(userRepository)
const getAllUsersController = new GetAllUsersController(getAllUsersUseCase)

/*getUserByEmail*/
const getUserByEmailUseCase = new GetUserByEmailUseCase(userRepository)
const getUserByEmailController = new GetUserByEmailController(getUserByEmailUseCase)

/*deleteUser*/
const verifyDeleteRolePermission = new VerifyRolePermissionsUseCase(new DeleteUserPermissions(getRoleUseCase))
const deleteUserUseCase = new DeleteUserUseCase(userRepository, verifyDeleteRolePermission)
const deleteUserController = new DeleteUserController(deleteUserUseCase)

export { createUserController, userLoginController, editUserController, getAllUsersController, getUserByEmailController, deleteUserController }