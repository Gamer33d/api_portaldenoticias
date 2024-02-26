import { FastifyInstance } from "fastify";
import { createUserController } from "../services/CreateUser/initializer";
import { ICreateUserRequestDTO } from "../entities/User";

export async function authRoute(fastify: FastifyInstance){
    fastify.post<{ Body: ICreateUserRequestDTO }>("/create", (req, reply) => {
        return createUserController.handler(req, reply);
    })
}