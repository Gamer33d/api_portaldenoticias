import fastify from "fastify";
import { HttpServerConfig } from "./infrastructure/HttpServerConfig";
import { RoutesRegister } from "./infrastructure/RoutesRegister";
import { ServerInitializer } from "./infrastructure/ServerInitializer";
import { RunServer } from "./infrastructure/Server/RunServer";
import { ServerBuilder } from "./infrastructure/Server/ServerBuilder";
require('dotenv').config()


const fastifyApp = fastify({}) 
const serverBuilder = new ServerBuilder({
    app: fastifyApp,
    httpServerConfig: new HttpServerConfig(fastifyApp),
    routesRegister: new RoutesRegister(fastifyApp), 
    logStatus: true
})

export const app = serverBuilder.build()

const server = new RunServer({
    port: process.env.PORT || 3000,
    app: app,
    serverInitializer: new ServerInitializer(),
    logStatus: true
})

server.run();
