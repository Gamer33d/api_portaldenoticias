import { FastifyInstance } from "fastify";
import { ICreateUserRequestDTO, IUserLoginDTO, } from "../entities/User";
import { createUserController, userLoginController } from '../services/UserUseCases/initializer'
import { authMiddlewareOptional } from "../middleware/authMiddleware";


export async function authRoute(fastify: FastifyInstance){

    fastify.post<{ Body: ICreateUserRequestDTO }>("/create", {preHandler: authMiddlewareOptional}, (req, reply) => {

        return createUserController.handler(req, reply);
    })
    fastify.post<{ Body: IUserLoginDTO }>('/login', (req, reply) => {
        return userLoginController.handler(req, reply)
    })
}