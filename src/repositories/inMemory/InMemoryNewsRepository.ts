import { ICreateNewsRequestDTO, INews, INewsRepository } from "../../entities/News";

export class InMemoryNewsRepository implements INewsRepository{
    private news: INews[] = []

    async createNews(newsData: ICreateNewsRequestDTO): Promise<INews> {
        const { title, content, description} = newsData
        const id = this.news.length + 1
        const newsPayload = {
            id,
            title,
            content,
            description
        }
        this.news.push(newsPayload)
        return newsPayload
    }

    async findNewsById(id: number): Promise<INews | undefined> {
        const newsData = this.news.find(news => news.id == id) || undefined
        return newsData
    }
}