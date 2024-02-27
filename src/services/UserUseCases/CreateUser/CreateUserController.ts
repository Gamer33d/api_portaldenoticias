import { FastifyReply, FastifyRequest } from "fastify";
import { CreateUserUseCase } from "./CreateUserUseCase";
import { ICreateUserRequestDTO } from "../../../entities/User";

export class CreateUserController {
    constructor (
        private createUserUseCase: CreateUserUseCase
    ){}

    public async handler(req: FastifyRequest<{Body: ICreateUserRequestDTO}>, reply: FastifyReply){
        const { name, email, password, roleId } = req.body
        try {
            if(!name || !email || !password){
                throw new Error('the body fields (name or email or password) is missing.')
            }

            const createdUser = await this.createUserUseCase.execute({
                name,
                email,
                password,
                roleId
            }, req.userLogged)
            
            return reply.status(201).send(createdUser)
        } catch (error) {
            return reply.status(400).send(error)
        }
        
    }
}