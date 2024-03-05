import { FastifyReply, FastifyRequest } from "fastify";
import { GetUserNewsUseCase } from "./GetUserNewsUseCase";

export class GetUserNewsController{
    constructor(
        private getUserNewsUseCase: GetUserNewsUseCase
    ){}

    async handler(req: FastifyRequest<{Params: {id: string}}>, reply: FastifyReply){
        const { id } = req.params
        try {
            if(!id){
                throw new Error('the id param is missing.')
            }    

            const userNews = this.getUserNewsUseCase.execute(id)
            return reply.status(200).send(userNews)
        } catch (error) {
            return reply.status(400).send(error)
        }
    }
}