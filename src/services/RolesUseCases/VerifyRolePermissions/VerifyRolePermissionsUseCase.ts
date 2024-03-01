import { IEditUserRequestDTO, IUser } from "../../../entities/User"
import { GetRoleUseCase } from "../GetRole/GetRoleUseCase"

interface IPermissionsToVerify {
    verify(userLogged: IUser, targetUser?: IUser, data?: any): Promise<boolean>
}
/*User Permissions*/

export class DeleteUserPermissions implements IPermissionsToVerify{
    constructor(
        private getRoleUseCase: GetRoleUseCase
    ){}

    async verify(userDeletor: IUser, userToDelete: IUser): Promise<boolean>{
        if(!userDeletor || !userToDelete || !this.getRoleUseCase){
            throw new Error('the params userDeletor or userToDelete or getRoleUseCase is missing.')
        }
        if(userDeletor.banned){
            return false
        }
        
        if(userDeletor.id === userToDelete.id){
            return true
        }
        
        if(userDeletor.id !== userToDelete.id && userDeletor.roleId){
            const userDeletorRole = await this.getRoleUseCase.execute(userDeletor.roleId);
            const userToDeleteRole = await this.getRoleUseCase.execute(userToDelete.roleId || NaN);
            
            if(userDeletorRole?.permissions.includes('*')){
                return true;
            }

            if(userDeletorRole?.permissions.includes('manage_users') && userToDeleteRole?.permissions.includes('manage_users')){
                return false
            }

            if(userDeletorRole?.permissions.includes('manage_users') && !userToDeleteRole?.permissions.includes('*')){   
                return true;
            }

            if(userDeletorRole?.permissions.includes('manage_users') && !userToDeleteRole){
                return true;
            }

            
            return false;
            
        }

        return false

    }
}

export class EditUserPermissions implements IPermissionsToVerify{
    constructor(
        private getRoleUseCase: GetRoleUseCase
    ){}

    async verify(editorUser: IUser, userToEdit: IUser, dataForEdit: IEditUserRequestDTO): Promise<boolean> {
        if(!editorUser || !userToEdit || !this.getRoleUseCase || !dataForEdit){
            throw new Error('the params userDeletor or userToDelete or getRoleUseCase or dataForEdit is missing.')
        }

        if(editorUser.banned){
            return false
        }
        
        if(editorUser.id !== userToEdit.id && editorUser.roleId){
            const editorRole = await this.getRoleUseCase.execute(editorUser.roleId);
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

        if(editorUser.id == userToEdit.id) {
            return true
        }

        return false
    
    }
}

/*News Permissions*/
export class CreateNewsPermissions implements IPermissionsToVerify{
    constructor(
        private getRoleUseCase: GetRoleUseCase
    ){}
    
    async verify(userLogged: IUser): Promise<boolean> {
        const userRole = await this.getRoleUseCase.execute(userLogged.roleId || NaN);
        if(!userRole){
            return false
        }

        if(userRole.permissions.includes('*')){
            return true
        }

        if(userRole.permissions.includes('manage_your_news')){
            return true
        }

        if(userRole.permissions.includes('manage_all_news')){
            return true
        }

        return false
    }
}

export class VerifyRolePermissionsUseCase{
    constructor(
        private permissionsToVerify: IPermissionsToVerify
    ){}

    public async execute(userLogged: IUser, targetUser?: IUser, data?: any): Promise<boolean>{
        const isAllowed = await this.permissionsToVerify.verify(userLogged, targetUser, data)
        return isAllowed
    }
}