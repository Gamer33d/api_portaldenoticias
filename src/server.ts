import fastify from "fastify";
import { authRoute } from "./routes/auth";

const server = fastify({})

server.register(authRoute, {
    prefix: "/auth"
})


server.listen({ port: 3030 }, () => {
    console.log("HTTP Server online!")
})