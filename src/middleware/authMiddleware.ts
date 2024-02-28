import { FastifyReply, FastifyRequest } from "fastify";
import { JWTPayload, JWTVerifyResult, jwtVerify } from "jose";
import { IUserLogged } from "../entities/User";



function handleToken(bruteToken?: string){
    return bruteToken?.split(' ')[1]
}

export async function authMiddlewareOptional(req: FastifyRequest, reply: FastifyReply){
    const authorizationToken = handleToken(req.headers['authorization'])
    if(!authorizationToken){
        return
    }
    
    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET)
        const { payload, protectedHeader } = await jwtVerify<{userData: IUserLogged}>(authorizationToken, secret)
        const { id, name, email, roleId, banned} = payload.userData
        return req.userLogged = {
            id,
            name,
            email,
            roleId,
            banned
        }
        
    } catch (error) {
        return reply.status(401).send({message: "authentication failed"})
    }
    
}

export async function authMiddlewareMandatory(req: FastifyRequest, reply: FastifyReply){
    const authorizationToken = handleToken(req.headers['authorization'])
    try {
        if(!authorizationToken){
            throw new Error("authentication failed")
        }
        const secret = new TextEncoder().encode(process.env.JWT_SECRET)
        const { payload, protectedHeader } = await jwtVerify<{userData: IUserLogged}>(authorizationToken, secret)
        const { id, name, email, roleId, banned} = payload.userData
        return req.userLogged = {
            id,
            name,
            email,
            roleId,
            banned
        }
        
    } catch (error) {
        console.log(error)
        return reply.status(401).send({message: 'authentication failed'})
    }


}