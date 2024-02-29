import { FastifyReply, FastifyRequest } from "fastify";
import { GetUserByEmailUseCase } from "./GetUserByEmailUseCase";

export class GetUserByEmailController {
    constructor(
        private getUserByEmailUseCase: GetUserByEmailUseCase
    ) { }

    async handler(req: FastifyRequest<{ Params: { email: string } }>, reply: FastifyReply) {
        const { email } = req.params
        try {
            if(!email){
                throw new Error('the body field email is missing.')
            }

            const userData = await this.getUserByEmailUseCase.execute(email)
            
            reply.status(200).send({data: userData})
        } catch (error) {
            reply.status(400).send(error)
        }
    }
}