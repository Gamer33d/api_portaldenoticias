import { FastifyInstance } from "fastify";
import { IUserLoginDTO } from "../entities/User";
import { userLoginController } from '../services/UserUseCases/initializer'

export async function authRoutes(fastify: FastifyInstance) {

    fastify.post<{ Body: IUserLoginDTO }>('/login', (req, reply) => {
        return userLoginController.handler(req, reply)
    });
    
}