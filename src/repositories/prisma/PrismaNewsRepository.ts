import { ICreateNewsRequestDTO, IEditNewsRequestDTO, INews, INewsRepository } from "../../entities/News";
import { prisma } from "../../infrastructure/db/PrismaClient";

export class PrismaNewsRepository implements INewsRepository{
    async getAllNews(): Promise<INews[]> {
        const news = await prisma.news.findMany()
        return news
    }

    async findNewsById(id: number): Promise<INews | null> {
        const news = await prisma.news.findFirst({
            where: {
                id
            }
        })

        return news
    }

    async createNews(data: ICreateNewsRequestDTO): Promise<INews> {
        try {
            const newsCreated = await prisma.news.create({
                data,
            })   
    
            return newsCreated
        } catch (error) {
            throw error
        }
    }
    
    async editNewsById(id: number, data: IEditNewsRequestDTO): Promise<INews> {
        try {
            const newsEdited = await prisma.news.update({
                where:{
                    id
                },
                data
            }) 

            return newsEdited
        } catch (error) {
            throw error
        }
    }

    async deleteNewsById(id: number): Promise<boolean> {
        try {
            await prisma.news.delete({
                where: {
                    id
                }
            })

            return true
        } catch (error) {
            throw error
        }
    }
}