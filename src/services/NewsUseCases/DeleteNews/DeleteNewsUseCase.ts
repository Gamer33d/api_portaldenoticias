import { INewsRepository } from "../../../entities/News";
import { IUser } from "../../../entities/User";
import { VerifyRolePermissionsUseCase } from "../../RolesUseCases/VerifyRolePermissions/VerifyRolePermissionsUseCase";

export class DeleteNewsUseCase {
    constructor(
        private newsRepository: INewsRepository,
        private verifyRolePermissions: VerifyRolePermissionsUseCase 
    ){}

    async execute(newsId: number, userLogged: IUser | undefined){
        if(!userLogged){
            throw new Error('you must be logged to delete any news.')
        }
        const newsToDelete = await this.newsRepository.findNewsById(newsId)
        if(!newsToDelete){
            throw new Error('this news does not exist.')
        }

        const isTheUserNotAuthorizedToDelete = ! await this.verifyRolePermissions.execute(userLogged, newsToDelete)
        if(isTheUserNotAuthorizedToDelete){
            throw new Error('you dont have permission to delete this news.')
        }

        const wasTheNewsDeleted = await this.newsRepository.deleteNewsById(newsToDelete.id) 
        if(wasTheNewsDeleted){
            return true
        }

        throw new Error('an internal error ocurred.')
    }
}