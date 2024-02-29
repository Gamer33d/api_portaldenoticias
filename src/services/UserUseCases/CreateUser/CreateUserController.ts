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

            const returnUserData = {
                id: createdUser.id,
                name: createdUser.name,
                email: createdUser.email

            }
            
            return reply.status(201).send({ message: 'user created successfully.', data: returnUserData})
        } catch (error) {
            return reply.status(400).send(error)
        }
        
    }
}