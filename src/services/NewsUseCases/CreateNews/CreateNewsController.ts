import { FastifyReply, FastifyRequest } from "fastify";
import { CreateNewsUseCase } from "./CreateNewsUseCase";
import { ICreateNewsRequestDTO } from "../../../entities/News";

export class CreateNewsController {
    constructor(
        private createNewsUseCase: CreateNewsUseCase
    ) { }

    async handler(req: FastifyRequest<{ Body: ICreateNewsRequestDTO }>, reply: FastifyReply) {
        const { title, description, content } = req.body
        try {
            if(!title || !description || !content){
                throw new Error("the body fields (title or description or content) is missing.")
            }

            const newsCreated = await this.createNewsUseCase.execute({
                title,
                description,
                content
            }, req.userLogged)

            return reply.status(201).send({data: newsCreated})
        } catch (error) {
            return reply.status(400).send(error)
        }
    }
}