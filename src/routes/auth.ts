import { FastifyInstance } from "fastify";
import { ICreateUserRequestDTO, IEditUserRequestDTO, IUserLoginDTO, } from "../entities/User";
import { createUserController, editUserController, userLoginController } from '../services/UserUseCases/initializer'
import { authMiddlewareMandatory, authMiddlewareOptional } from "../middleware/authMiddleware";


export async function authRoute(fastify: FastifyInstance){

    fastify.post<{ Body: ICreateUserRequestDTO }>("/create", {preHandler: authMiddlewareOptional}, (req, reply) => {
        return createUserController.handler(req, reply);
    })
    fastify.post<{ Body: IUserLoginDTO }>('/login', (req, reply) => {
        return userLoginController.handler(req, reply)
    })

    fastify.patch<{ Body: IEditUserRequestDTO, Params: {id: string} }>('/edit/:id', {preHandler: authMiddlewareMandatory}, (req, reply) => {
        return editUserController.handler(req, reply)
    })
}