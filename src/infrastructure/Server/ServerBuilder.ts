import { FastifyInstance } from "fastify"
import { HttpServerConfig } from "../HttpServerConfig"
import { RoutesRegister } from "../RoutesRegister"
import colors from 'colors'
import { print } from "../../utils/print"

//Separating the build and configuration to facilitate test creation
export class ServerBuilder {
    private app: FastifyInstance
    private httpServerConfig: HttpServerConfig
    private routesRegister: RoutesRegister
    private logStatus: boolean

    constructor({ app, httpServerConfig, routesRegister, logStatus = false }: {
        app: FastifyInstance,
        httpServerConfig: HttpServerConfig,
        routesRegister: RoutesRegister,
        logStatus?: boolean
    }) {
        this.app = app;
        this.httpServerConfig = httpServerConfig;
        this.routesRegister = routesRegister;
        this.logStatus = logStatus
    }   

    build(){
        try {
            print(colors.yellow('----[BUILDING APP]----'), this.logStatus)
            this.httpServerConfig.configure(this.logStatus)
            this.routesRegister.register(this.logStatus)  

            return this.app
        } catch (error) {
            console.log(error)
            throw error
        }
    }
}