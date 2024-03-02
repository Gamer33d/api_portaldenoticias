import { IEditNewsRequestDTO, INewsRepository } from "../../../entities/News";
import { IUser } from "../../../entities/User";
import { VerifyRolePermissionsUseCase } from "../../RolesUseCases/VerifyRolePermissions/VerifyRolePermissionsUseCase";

export class EditNewsUseCase{
    constructor(
        private newsRepository: INewsRepository,
        private verifyRolePermission: VerifyRolePermissionsUseCase
    ){}
    
    async execute(newsId: number, editPayload: IEditNewsRequestDTO, userLogged: IUser | undefined){
        const { title, content, description } = editPayload
        if(!userLogged){
            throw new Error('you must be logged to edit any news')
        }
 
        const originalNews = await this.newsRepository.findNewsById(newsId)
        if(!originalNews){
            throw new Error('this news does not exist.')
        }

        if(description && description.length > 180){
            throw new Error('the maximum value of characters in description is 180. The value provided was exceeded')
        }

        if(title && title.length > 60){
            throw new Error('the maximum value of characters in title is 60. The value provided was exceeded')
        }

        const isTheUserNotAuthorizedToEdit = !await this.verifyRolePermission.execute(userLogged, originalNews)
        if(isTheUserNotAuthorizedToEdit){
            throw new Error('you dont have permission to edit this news')
        }

        const newsEditResponse = await this.newsRepository.editNewsById(newsId, editPayload)
        return newsEditResponse


    }   

}