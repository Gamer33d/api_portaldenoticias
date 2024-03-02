import { FastifyReply, FastifyRequest } from "fastify";
import { IEditNewsRequestDTO } from "../../../entities/News";
import { EditNewsUseCase } from "./EditNewsUseCase";

export class EditNewsController {
    constructor(
        private editNewsUseCase: EditNewsUseCase
    ){}

    async handler(req: FastifyRequest<{Params: {id: string}, Body: IEditNewsRequestDTO}>, reply: FastifyReply){
        const { id } = req.params
        const { title, content, description } = req.body
        try {
            if(!id) throw new Error('the body field id is missing.')
            const convertedId = Number(id)

            const editPayload = {
                title,
                content,
                description
            }

            const editNewsResponse = await this.editNewsUseCase.execute(convertedId, editPayload, req.userLogged)

            return reply.status(200).send({data: editNewsResponse})
        } catch (error) {
            return reply.status(400).send(error)
        }
    }
}