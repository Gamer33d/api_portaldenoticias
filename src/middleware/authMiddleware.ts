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
    
}