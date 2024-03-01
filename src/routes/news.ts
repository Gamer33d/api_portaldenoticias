import { FastifyInstance } from "fastify";
import { ICreateNewsRequestDTO } from "../entities/News";
import { AuthMiddleware } from "../middleware/authMiddleware";
import { createNewsController } from "../services/NewsUseCases/initializer";

export async function newsRoutes(fastify: FastifyInstance){
    const authMiddleware = new AuthMiddleware()

    fastify.post<{ Body: ICreateNewsRequestDTO }>('/create', {preHandler: authMiddleware.verifyTokenMandatory}, async (req, reply) => {
        return createNewsController.handler(req, reply)
    })
}