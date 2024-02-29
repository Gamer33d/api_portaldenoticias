import { FastifyReply, FastifyRequest } from "fastify";
import { GetAllUsersUseCase } from "./GetAllUsersUseCase";

export class GetAllUsersController{
    constructor(
        private getAllUserUseCase: GetAllUsersUseCase
    ){}

    async handler(req: FastifyRequest, reply: FastifyReply){
        try {
            const users = await this.getAllUserUseCase.execute()
            return reply.status(200).send({data: users})
        } catch (error) {
            reply.status(500).send(error)
        }
    }
}