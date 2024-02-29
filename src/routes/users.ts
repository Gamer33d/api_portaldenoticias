import { FastifyInstance } from "fastify";
import { ICreateUserRequestDTO, IEditUserRequestDTO, IUserLoginDTO, } from "../entities/User";
import { createUserController, deleteUserController, editUserController, getAllUsersController, getUserByEmailController } from '../services/UserUseCases/initializer'
import { AuthMiddleware } from "../middleware/authMiddleware";


export async function usersRoutes(fastify: FastifyInstance){
    const authMiddleware = new AuthMiddleware()
    fastify.get('/', (req, reply) => {
        return getAllUsersController.handler(req, reply)
    });

    fastify.get<{ Params: { email: string } }>('/:id', (req, reply) => {
        return getUserByEmailController.handler(req, reply)
    })

    fastify.post<{ Body: ICreateUserRequestDTO }>("/create", { preHandler: authMiddleware.verifyTokenOptional }, (req, reply) => {
        return createUserController.handler(req, reply);
    });

    fastify.patch<{ Body: IEditUserRequestDTO, Params: { id: string } }>('/edit/:id', { preHandler: authMiddleware.verifyTokenMandatory }, (req, reply) => {
        return editUserController.handler(req, reply)
    });

    fastify.delete<{ Params: {id: string}}>('/delete/:id', {preHandler: authMiddleware.verifyTokenMandatory}, (req, reply) => {
        return deleteUserController.handler(req, reply)
    })
}