import fastify from "fastify";
import { authRoutes } from "./routes/auth";
import { IUser } from "./entities/User";
import { usersRoutes } from "./routes/users";
require('dotenv').config()

const server = fastify({})

declare module 'fastify'{
    interface FastifyRequest{
        userLogged: IUser | undefined
    }
}


server.decorateRequest('userLogged', null)

server.register(authRoutes, {
    prefix: "/auth",
})

server.register(usersRoutes, {
    prefix: '/users'
})

server.get('/', (req, reply) => {
    reply.send('hello world!')
})

server.listen({ port: 3030 }, () => {
    console.log("HTTP Server online!")

})