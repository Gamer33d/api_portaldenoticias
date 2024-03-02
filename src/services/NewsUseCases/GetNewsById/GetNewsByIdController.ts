import { FastifyReply, FastifyRequest } from "fastify";
import { GetNewsByIdUseCase } from "./GetNewsByIdUseCase";

export class GetNewsByIdController{
    constructor(
        private getNewsByIdUseCase: GetNewsByIdUseCase
    ){}

    async handler(req: FastifyRequest<{Params: {id: string}}>, reply: FastifyReply){
        const { id } = req.params
        try {
            if(!id) throw new Error('the body field id is missing.')
            const convertedId = Number(id)    

            const newsResponse = await this.getNewsByIdUseCase.execute(convertedId)

            return reply.status(200).send({data: newsResponse})
        } catch (error) {
            return reply.status(400).send(error)
        }
    }
}