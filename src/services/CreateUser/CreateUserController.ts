import { FastifyReply, FastifyRequest } from "fastify";
import { CreateUserUseCase } from "./CreateUserUseCase";
import { ICreateUserRequestDTO } from "../../entities/User";

export class CreateUserController {
    constructor (
        private createUserUseCase: CreateUserUseCase
    ){}

    public async handler(req: FastifyRequest<{Body: ICreateUserRequestDTO}>, reply: FastifyReply){
        const { name, email, password, roleId } = req.body
        try {
            if(!name || !email || !password){
                throw new Error('body fields name or email or password is missing.')
            }

            await this.createUserUseCase.execute({
                name,
                email,
                password,
                roleId
            }, null)
            
            return reply.status(201).send()
        } catch (error) {
            return reply.status(400).send(error)
        }
        
    }
}