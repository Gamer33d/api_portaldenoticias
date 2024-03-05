import { ICreateNewsRequestDTO, INewsRepository } from "../../../entities/News";
import { IUser } from "../../../entities/User";
import { VerifyRolePermissionsUseCase } from "../../RolesUseCases/VerifyRolePermissions/VerifyRolePermissionsUseCase";

export class CreateNewsUseCase{
    constructor(
        private newsRepository: INewsRepository,
        private verifyRolePermission: VerifyRolePermissionsUseCase
    ){}

    async execute(newsPayload: ICreateNewsRequestDTO, userLogged: IUser | undefined){
        const { title, description, content } = newsPayload
        if(!userLogged){
            throw new Error('you must be logged to create any news')
        }

        if(userLogged.banned){
            throw new Error('you dont have permission to create a news (banned)')
        }

        if(description.length > 180){
            throw new Error('the maximum value of characters in description is 180. The value provided was exceeded')
        }

        if(title.length > 60){
            throw new Error('the maximum value of characters in title is 60. The value provided was exceeded')
        }

        const isUserNotAllowedToCreateANews  = !await this.verifyRolePermission.execute(userLogged)
        if(isUserNotAllowedToCreateANews ){
            throw new Error('you dont have permission to create a news')
        }
        
        const newsData = await this.newsRepository.createNews({
            title,
            description,
            content,
            userId: userLogged.id
        })
        return newsData
    }   
}