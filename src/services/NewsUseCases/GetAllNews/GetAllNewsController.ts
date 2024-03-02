import { FastifyReply, FastifyRequest } from "fastify";
import { GetAllNewsUseCase } from "./GetAllNewsUseCase";

export class GetAllNewsController{
    constructor(
        private getAllNewsUseCase: GetAllNewsUseCase
    ){}

    async handler(req: FastifyRequest, reply: FastifyReply){
        try {
            const allNews = await this.getAllNewsUseCase.execute()
            return reply.status(200).send(allNews)
        } catch (error) {
            return reply.status(400).send(error)
        }
    }
}