import { INews } from "../../../entities/News"
import { IEditUserRequestDTO, IUser } from "../../../entities/User"
import { GetRoleUseCase } from "../GetRole/GetRoleUseCase"

interface IPermissionsToVerify {
    verify(...args: any[]): Promise<boolean>
}
/*User Permissions*/

export class DeleteUserPermissions implements IPermissionsToVerify{


    async verify(getRoleUseCase: GetRoleUseCase, ...args: any[]): Promise<boolean>{
        const [userDeletor, userToDelete]  = args
        if(!userDeletor || !userToDelete || !getRoleUseCase){
            throw new Error('the params userDeletor or userToDelete or getRoleUseCase is missing.')
        }
        if(userDeletor.banned){
            return false
        }
        
        if(userDeletor.id === userToDelete.id){
            return true
        }
        
        if(userDeletor.id !== userToDelete.id && userDeletor.roleId){
            const userDeletorRole = await getRoleUseCase.execute(userDeletor.roleId);
            const userToDeleteRole = await getRoleUseCase.execute(userToDelete.roleId || NaN);
            
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

    async verify(getRoleUseCase: GetRoleUseCase, ...args: any[]): Promise<boolean>{
        const [editorUser, userToEdit, dataForEdit] = args
        if(!editorUser || !userToEdit || !getRoleUseCase || !dataForEdit){
            throw new Error('the params userDeletor or userToDelete or getRoleUseCase or dataForEdit is missing.')
        }

        if(editorUser.banned){
            return false
        }
        
        if(editorUser.id !== userToEdit.id && editorUser.roleId){
            const editorRole = await getRoleUseCase.execute(editorUser.roleId);
            const userToEditRole = await getRoleUseCase.execute(userToEdit.roleId || NaN);
            
            
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
    
    async verify(getRoleUseCase: GetRoleUseCase, ...args: any[]): Promise<boolean>{
        const [userLogged] = args
        const userRole = await getRoleUseCase.execute(userLogged.roleId || NaN);
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

export class EditNewsPermissions implements IPermissionsToVerify{
    async verify(getRoleUseCase: GetRoleUseCase, ...args: any[]): Promise<boolean>{
        const [userLogged, originalNews] = args
        const userRole = await getRoleUseCase.execute(userLogged.roleId || NaN);
        if(!originalNews){
            throw new Error('the param originalNews not provided')
        }
        if(!userRole){
            return false
        }

        if(userRole.permissions.includes('*')){
            return true
        }
        if(userRole.permissions.includes('manage_your_news') && userLogged.id == originalNews.userId){
            return true
        }

        if(userRole.permissions.includes('manage_all_news')){
            return true
        }
        return false
    }
}

export class DeleteNewsPermissions implements IPermissionsToVerify{
    async verify(getRoleUseCase: GetRoleUseCase, ...args: any ): Promise<boolean>{
        const [userLogged, news] = args
        const userRole = await getRoleUseCase.execute(userLogged.roleId || NaN);
        if(!news){
            throw new Error('the param originalNews not provided')
        }
        if(!userRole){
            return false
        }

        if(userRole.permissions.includes('*')){
            return true
        }
        if(userRole.permissions.includes('manage_your_news') && userLogged.id == news.userId){
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
        private permissionsToVerify: IPermissionsToVerify,
        private getRoleUseCase: GetRoleUseCase
    ){}

    public async execute(...args: any[]): Promise<boolean>{
        const isAllowed = await this.permissionsToVerify.verify(this.getRoleUseCase, ...args)
        return isAllowed
    }
}