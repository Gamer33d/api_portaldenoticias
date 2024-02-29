import { FastifyReply, FastifyRequest } from "fastify";
import { GetUserByIdUseCase } from "./GetUserByIdUseCase";

export class GetUserByIdController {
    constructor(
        private getUserByIdUseCase: GetUserByIdUseCase
    ) { }

    async handler(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
        const { id } = req.params
        try {
            if(!id){
                throw new Error('the body field id is missing.')
            }

            const userData = await this.getUserByIdUseCase.execute(id)
            
            reply.status(200).send({data: userData})
        } catch (error) {
            reply.status(400).send(error)
        }
    }
}