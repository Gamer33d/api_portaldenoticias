import { INewsRepository } from "../../../entities/News";

export class GetAllNewsUseCase {
    constructor(
        private newsRepository: INewsRepository
    ) { }

    async execute(){
        const allNews = await this.newsRepository.getAllNews()
        return allNews
    }
}