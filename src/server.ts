import fastify from "fastify";
import jose from 'jose'
import { authRoute } from "./routes/auth";
import { IUserLogged } from "./entities/User";
const server = fastify({})
require('dotenv').config()


declare module 'fastify'{
    interface FastifyRequest{
        userLogged: IUserLogged | null
    }
}


server.decorateRequest('userLogged', null)

server.register(authRoute, {
    prefix: "/auth",
})

server.listen({ port: 3030 }, () => {
    console.log("HTTP Server online!")

})