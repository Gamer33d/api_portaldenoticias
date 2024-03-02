import { FastifyInstance } from "fastify";
import { ICreateNewsRequestDTO, IEditNewsRequestDTO } from "../entities/News";
import { AuthMiddleware } from "../middleware/authMiddleware";
import { createNewsController, deleteNewsController, editNewsController, getAllNewsController, getNewsByIdController } from "../services/NewsUseCases/initializer";

export async function newsRoutes(fastify: FastifyInstance) {
    const authMiddleware = new AuthMiddleware()

    fastify.get('/', async (req, reply) => {
        return getAllNewsController.handler(req, reply)
    })

    fastify.get<{ Params: { id: string } }>('/:id', async (req, reply) => {
        return getNewsByIdController.handler(req, reply)
    })


    fastify.post<{ Body: ICreateNewsRequestDTO }>('/create', { preHandler: authMiddleware.verifyTokenMandatory }, async (req, reply) => {
        return createNewsController.handler(req, reply)
    })

    fastify.patch<{ Params: { id: string }, Body: IEditNewsRequestDTO }>('/edit/:id', { preHandler: authMiddleware.verifyTokenMandatory }, async (req, reply) => {
        return editNewsController.handler(req, reply)
    })

    fastify.delete<{ Params: { id: string } }>('/delete/:id', { preHandler: authMiddleware.verifyTokenMandatory }, async (req, reply) => {
        return deleteNewsController.handler(req, reply)
    })
}