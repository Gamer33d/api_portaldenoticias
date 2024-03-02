import { INewsRepository } from "../../../entities/News";

export class GetNewsByIdUseCase{
    constructor(
        private newsRepository: INewsRepository
    ){}

    async execute(id: number){
        const newsData = await this.newsRepository.findNewsById(id)
        if(!newsData){
            throw new Error("this news does not exist.")
        }

        return newsData
    }
}