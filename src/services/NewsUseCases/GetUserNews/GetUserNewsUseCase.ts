import { INewsRepository } from "../../../entities/News";

export class GetUserNewsUseCase{
    constructor(
        private newsRepository: INewsRepository
    ){}

    async execute(userId: string){
        const userNews = await this.newsRepository.getNewsByUserId(userId)
        return userNews;
    }
}