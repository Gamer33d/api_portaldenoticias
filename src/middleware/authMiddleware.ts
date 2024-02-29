import { FastifyReply, FastifyRequest } from "fastify";
import { JWTPayload, JWTVerifyResult, jwtVerify } from "jose";
import { IUser } from "../entities/User";


export class AuthMiddleware {

    private handleToken(bruteToken?: string) {
        return bruteToken?.split(' ')[1]
    }

    public async verifyTokenOptional(req: FastifyRequest, reply: FastifyReply) {
        const authorizationToken = this.handleToken(req.headers['authorization'])
        if (!authorizationToken) {
            return
        }

        try {
            const secret = new TextEncoder().encode(process.env.JWT_SECRET)
            const { payload, protectedHeader } = await jwtVerify<{ userData: IUser }>(authorizationToken, secret)
            const { id, name, email, roleId, banned } = payload.userData
            return req.userLogged = {
                id,
                name,
                email,
                roleId,
                banned
            }

        } catch (error) {
            return reply.status(401).send({ message: "authentication failed" })
        }

    }

    public async verifyTokenMandatory(req: FastifyRequest, reply: FastifyReply) {
        const authorizationToken = this.handleToken(req.headers['authorization'])
        try {
            if (!authorizationToken) {
                throw new Error("authentication failed")
            }
            const secret = new TextEncoder().encode(process.env.JWT_SECRET)
            const { payload, protectedHeader } = await jwtVerify<{ userData: IUser }>(authorizationToken, secret)
            const { id, name, email, roleId, banned } = payload.userData
            return req.userLogged = {
                id,
                name,
                email,
                roleId,
                banned
            }

        } catch (error) {
            console.log(error)
            return reply.status(401).send({ message: 'authentication failed' })
        }

    }
}