import { FastifyReply, FastifyRequest } from "fastify";
import { UserLoginUseCase } from "./UserLoginUseCase";
import { IUserLoginDTO } from "../../../entities/User";

export class UserLoginController{

    constructor(
        private userLoginUseCase: UserLoginUseCase
    ){}

    async handler(req: FastifyRequest<{ Body:IUserLoginDTO }>, reply: FastifyReply){
        const { email, password } = req.body
        try {
            if(!email || !password){
                throw new Error("the body fields (email or password) is missing.")
            }

            const result = await this.userLoginUseCase.execute({
                email,
                password
            })
            
            return reply.status(200).send({ data: {token: result} })
        } catch (error) {
            return reply.status(401).send(error)
        }
    }
}