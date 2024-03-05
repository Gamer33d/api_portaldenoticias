import { FastifyInstance } from "fastify";
import colors from 'colors'
import { ServerInitializer } from "../ServerInitializer";
import { print } from "../../utils/print";

//Start the server.
export class RunServer{
    private port: number
    private app: FastifyInstance
    private serverInitializer: ServerInitializer;
    private logStatus: boolean
    constructor({
        port, app, serverInitializer, logStatus = false
    }: {
        port: number | string, 
        app: FastifyInstance, 
        serverInitializer: ServerInitializer,
        logStatus?: boolean
    }){
        this.port = Number(port)
        this.app = app,
        this.serverInitializer = serverInitializer
        this.logStatus = logStatus
    }

    public async run(){
        try {
            print(colors.yellow("-----[STARTING]----"), this.logStatus)

            await this.serverInitializer.initialize(this.app, this.logStatus, this.port)    

            print(colors.green(`[DONE] Server started in port ${this.port}`), this.logStatus)

            return this.app
        } catch (error) {
            console.log(error)
            throw error
        }
    }
}

