import { FastifyReply, FastifyRequest } from "fastify";
import { DeleteNewsUseCase } from "./DeleteNewsUseCase";

export class DeleteNewsController {
    constructor(
        private deleteNewsUseCase: DeleteNewsUseCase
    ) { }

    async handler(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
        const { id } = req.params
        try {
            if(!id) throw new Error('the body field id is missing.')
            const convertedId = Number(id)

            await this.deleteNewsUseCase.execute(convertedId, req.userLogged)
            return reply.status(204).send()
        } catch (error) {
            return reply.status(400).send(error)
        }
    }
}