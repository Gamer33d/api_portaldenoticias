import { IUser, IUserRepository } from "../../../entities/User";
import { GetRoleUseCase } from "../../RolesUseCases/GetRole/GetRoleUseCase";
import { VerifyRolePermissionsUseCase } from "../../RolesUseCases/VerifyRolePermissions/VerifyRolePermissionsUseCase";

export class DeleteUserUseCase{
    constructor(
        private usersRepository: IUserRepository,
        private verifyRolePermissionsUseCase: VerifyRolePermissionsUseCase,
    ){}
    
    


    async execute(id: string, userLogged: IUser | undefined){
        const userToDelete = await this.usersRepository.findUserById(id)
        if(!userToDelete){
            throw new Error('this user does not exist.')
        }

        if(!userLogged){
            throw new Error('you must be logged to delete any user')
        }

        const isUserNotAuthorizedToDelete = !await this.verifyRolePermissionsUseCase.execute(userLogged, userToDelete)
        if(isUserNotAuthorizedToDelete){
            throw new Error('you dont have permission to delete this user.')
        }

        const hasTheUserBeenDeleted = await this.usersRepository.deleteUserById(id)
        if(hasTheUserBeenDeleted){
            return true
        }

        throw new Error("an internal error occurred.")
    }
}