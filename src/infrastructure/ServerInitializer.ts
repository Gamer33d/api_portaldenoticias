import { FastifyInstance } from "fastify"

export class ServerInitializer{
    async initialize(app: FastifyInstance, logStatus: boolean, port: number): Promise<void>{
        if(logStatus){
            console.log("Starting HTTP Server...")
        }
        await app.listen({port})
    }
}