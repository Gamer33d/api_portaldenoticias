import { hashSync } from "bcrypt";
import { IRole } from "../../../entities/Roles";
import { IEditUserRequestDTO, IUser, IUserRepository } from "../../../entities/User";
import { GetRoleUseCase } from "../../RolesUseCases/GetRole/GetRoleUseCase";

export class EditUserUseCase {
    constructor(
        private getRoleUseCase: GetRoleUseCase,
        private userRepository: IUserRepository
        ){}
        
    private async checkPermissions(editor: IUser, userToEdit: IUser, dataForEdit: IEditUserRequestDTO){
        if(editor.banned){
            return false
        }
        
        
        if(editor.id !== userToEdit.id && editor.roleId){
            const editorRole = await this.getRoleUseCase.execute(editor.roleId);
            const userToEditRole = await this.getRoleUseCase.execute(userToEdit.roleId || NaN);
            
            
            if(!editorRole){
                return false
            }

            if(editorRole?.permissions.includes('manage_users') && userToEditRole?.permissions.includes('manage_users')){
                return false
            }

            if(!editorRole.permissions.includes('*') && dataForEdit.roleId && dataForEdit.roleId <= 2){
                return false
            }

            if(editorRole.permissions.includes('*')){
                return true
            }

            
            if(editorRole.permissions.includes('manage_users') && !userToEditRole?.permissions.includes('*')){                
                return true
            }
            
            if(editorRole.permissions.includes('manage_users') && !userToEditRole){  
                return true
            }

            return false
        }

        if(editor.id == userToEdit.id) {
            return true
        }

    
    }

    async execute(dataForEdit: IEditUserRequestDTO, userId: string, userLogged: IUser | undefined){
        if(!userLogged){
            throw new Error('you must be logged to edit any user.')

        }
        
        const userToEdit = await this.userRepository.findUserById(userId)
        const editor = await this.userRepository.findUserById(userLogged.id)

        if(!userToEdit){
            throw new Error('the user to be edited does not exist.')
        }

        if(!editor){
            throw new Error('you must be logged to edit any user.')
        }


        const doesTheEditorHavePermission = await this.checkPermissions(editor, userToEdit, dataForEdit)
        if(!doesTheEditorHavePermission){
            throw new Error('you dont have permission to edit this user.')
        }

        if(dataForEdit.password){
            dataForEdit.password = hashSync(dataForEdit.password, 10)
        }

        const userEdited = await this.userRepository.editUser(dataForEdit, userId)
        return userEdited

    }
}