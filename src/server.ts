import fastify from "fastify";
import jose from 'jose'
import { authRoutes } from "./routes/auth";
import { IUser } from "./entities/User";
import { usersRoutes } from "./routes/users";
const server = fastify({})
require('dotenv').config()


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

server.listen({ port: 3030 }, () => {
    console.log("HTTP Server online!")

})