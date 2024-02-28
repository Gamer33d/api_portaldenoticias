import { FastifyReply, FastifyRequest } from "fastify";
import { EditUserUseCase } from "./EditUserUseCase";
import { IEditUserRequestDTO } from "../../../entities/User";

export class EditUserController{
    constructor(
        private editUserUseCase: EditUserUseCase
    ){}

    async handler(req: FastifyRequest<{ Body: IEditUserRequestDTO, Params: {id: string} }>, reply: FastifyReply){
        const { id } = req.params
        const { name, email, password, avatarUrl, banned, roleId } = req.body
        try {
            if(!id){
                throw new Error('param id is missing.')
            }

            const userEdited = await this.editUserUseCase.execute({
                name,
                email,
                password,
                avatarUrl,
                banned,
                roleId
            }, id, req.userLogged)

            reply.status(200).send(userEdited)
        } catch (error) {
            return reply.status(400).send(error)
        }
    }
}