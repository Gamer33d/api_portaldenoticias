import { IUser, IUserRepository } from "../../../entities/User";
import { GetRoleUseCase } from "../../RolesUseCases/GetRole/GetRoleUseCase";

export class DeleteUserUseCase{
    constructor(
        private getRoleUseCase: GetRoleUseCase,
        private usersRepository: IUserRepository
    ){}

    private async checkPermissions(editor: IUser, userToDelete: IUser){
        if(editor.banned){
            return false
        }
        
        if(editor.id === userToDelete.id){
            return true
        }
        
        if(editor.id !== userToDelete.id && editor.roleId){
            const editorRole = await this.getRoleUseCase.execute(editor.roleId);
            const userToDeleteRole = await this.getRoleUseCase.execute(userToDelete.roleId || NaN);
            
            if(editorRole?.permissions.includes('*')){
                return true;
            }

            if(editorRole?.permissions.includes('manage_users') && userToDeleteRole?.permissions.includes('manage_users')){
                return false
            }

            if(editorRole?.permissions.includes('manage_users') && !userToDeleteRole?.permissions.includes('*')){   
                return true;
            }

            if(editorRole?.permissions.includes('manage_users') && !userToDeleteRole){
                return true;
            }

            
            return false;
            
        }
    }

    async execute(id: string, userLogged: IUser | undefined){
        const userToDelete = await this.usersRepository.findUserById(id)
        if(!userToDelete){
            throw new Error('this user does not exist.')
        }

        if(!userLogged){
            throw new Error('you must be logged to delete any user')
        }

        const isUserNotAuthorizedToDelete = ! await this.checkPermissions(userLogged, userToDelete)
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