import { hashSync } from "bcrypt";
import { IRole } from "../../../entities/Roles";
import { IEditUserRequestDTO, IUser, IUserRepository } from "../../../entities/User";
import { GetRoleUseCase } from "../../RolesUseCases/GetRole/GetRoleUseCase";
import { VerifyRolePermissionsUseCase } from "../../RolesUseCases/VerifyRolePermissions/VerifyRolePermissionsUseCase";

export class EditUserUseCase {
    constructor(
        private verifyRolePermission: VerifyRolePermissionsUseCase,
        private userRepository: IUserRepository
        ){}
        

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

        if(!dataForEdit){
            throw new Error('data to be edited not provided.')
        }


        const doesTheEditorHavePermission = await this.verifyRolePermission.execute(editor, userToEdit, dataForEdit)
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