import { ICreateNewsRequestDTO, IEditNewsRequestDTO, INews, INewsRepository } from "../../entities/News";

export class InMemoryNewsRepository implements INewsRepository{
    private news: INews[] = []
    
    async getAllNews(): Promise<INews[]> {
        return this.news 
    }
    
    async findNewsById(id: number): Promise<INews | undefined> {
        const newsData = this.news.find(news => news.id == id) || undefined
        return newsData
    }
    
    async createNews(newsData: ICreateNewsRequestDTO): Promise<INews> {
        const { title, content, description, userId} = newsData
        const id = this.news.reduce((acc, news) => news.id > acc ? news.id : acc, 0) + 1;
        const newsPayload = {
            id,
            title,
            content,
            description,
            userId
        }
        this.news.push(newsPayload)
        return newsPayload
    }

    async editNewsById(id: number, editRequestDTO: IEditNewsRequestDTO): Promise<INews> {
        const { title, content, description } = editRequestDTO

        const newsToEditIndex = this.news.findIndex(news => news.id === id)
        const originalNews = this.news[newsToEditIndex]
        const editPayload = {
            id: originalNews.id,
            title: title??originalNews.title,
            content: content??originalNews.content,
            description: description??originalNews.description,
            userId: originalNews.userId
        }

        this.news[newsToEditIndex] = editPayload
        return editPayload
    }

    async deleteNewsById(id: number): Promise<boolean> {
        const newsIndex = this.news.findIndex(news => news.id === id)
        this.news.splice(newsIndex, 1)
        return true
    }
}