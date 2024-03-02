import { IUser } from "./User";

export interface ICreateNewsRequestDTO {
    title: string;
    description: string;
    content: string;
    userId: string;
}

export interface IEditNewsRequestDTO{
    title?: string;
    description?: string;
    content?: string;
}

export interface INews {
    id: number;
    title: string;
    description: string;
    content: string;
    userId: string;
}

export interface INewsRepository {
    getAllNews(): Promise<INews[]>
    findNewsById(id: number): Promise<INews | undefined>
    createNews(newsData: ICreateNewsRequestDTO): Promise<INews>
    editNewsById(id: number, editPayload: IEditNewsRequestDTO): Promise<INews>
    deleteNewsById(id: number): Promise<boolean>
}
