import { FastifyInstance } from "fastify";
import { ICreateUserRequestDTO, IEditUserRequestDTO, IUserLoginDTO, } from "../entities/User";
import { createUserController, editUserController, getAllUsersController, getUserByIdController, userLoginController } from '../services/UserUseCases/initializer'
import { AuthMiddleware } from "../middleware/authMiddleware";


export async function usersRoutes(fastify: FastifyInstance){
    const authMiddleware = new AuthMiddleware()
    fastify.get('/', (req, reply) => {
        return getAllUsersController.handler(req, reply)
    });

    fastify.get<{ Params: { id: string } }>('/:id', (req, reply) => {
        return getUserByIdController.handler(req, reply)
    })

    fastify.post<{ Body: ICreateUserRequestDTO }>("/create", { preHandler: authMiddleware.verifyTokenOptional }, (req, reply) => {
        return createUserController.handler(req, reply);
    });

    fastify.patch<{ Body: IEditUserRequestDTO, Params: { id: string } }>('/edit/:id', { preHandler: authMiddleware.verifyTokenMandatory }, (req, reply) => {
        return editUserController.handler(req, reply)
    });
}