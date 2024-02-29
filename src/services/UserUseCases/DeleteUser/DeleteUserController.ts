import { FastifyReply, FastifyRequest } from "fastify";
import { DeleteUserUseCase } from "./DeleteUserUseCase";

export class DeleteUserController{
    constructor(
        private deleteUserUseCase: DeleteUserUseCase
    ){}

    async handler(req: FastifyRequest<{Params: {id: string}}>, reply: FastifyReply){
        const { id } = req.params
        try {
            if(!id){
                throw new Error('the body field id is missing.')
            }

            const isUserHasBeenDeleted = await this.deleteUserUseCase.execute(id, req.userLogged || undefined)
            if(isUserHasBeenDeleted){
                return reply.status(204).send()
            }
        } catch (error) {
            return reply.status(400).send(error)
        }
    }
}