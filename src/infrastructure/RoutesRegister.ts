import { FastifyInstance } from "fastify"
import { authRoutes } from "../routes/auth"
import { usersRoutes } from "../routes/users"
import { newsRoutes } from "../routes/news"

export class RoutesRegister {
    constructor(private app: FastifyInstance) { }

    register(logStatus: boolean) {
        if(logStatus){
            console.log("Registering routes...")
        }
        this.app.register(authRoutes, { prefix: "/auth" })

        this.app.register(usersRoutes, { prefix: '/users' })

        this.app.register(newsRoutes, { prefix: "/news" })

        this.app.get('/', (req, reply) => {
            reply.send('hello world!')
        })
    }
}