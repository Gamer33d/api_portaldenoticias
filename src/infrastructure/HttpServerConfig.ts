import { FastifyInstance } from "fastify";

export class HttpServerConfig{
    constructor (private app: FastifyInstance){}

    configure(logStatus: boolean): void{
        if(logStatus){
            console.log("Setting up http server")
        }
        this.app.decorateRequest('userLogged', null)
    }
}