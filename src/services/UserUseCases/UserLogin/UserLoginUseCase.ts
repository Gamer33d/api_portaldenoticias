import { IUser, IUserLoginDTO, IUserRepository } from "../../../entities/User";
import bcrypt from 'bcrypt'
import { SignJWT } from 'jose'

export class UserLoginUseCase{

    constructor(
        private userRepository: IUserRepository
    ){}

    async execute(loginData: IUserLoginDTO){
        const { email, password } = loginData 
        const userDataOfDatabase = await this.userRepository.findUserByEmailOrName(email, undefined)
        if(!userDataOfDatabase){
            throw new Error("either the email or password is incorrect.")
        }
        
        const isThePasswordNotCorrect = !bcrypt.compareSync(password, userDataOfDatabase?.password || 'placeholder')
        if(isThePasswordNotCorrect){
            throw new Error('either the email or password is incorrect.')
        }
        
        
        const secretTokenSign = new TextEncoder().encode(process.env.JWT_SECRET)
        const jwtPayload: IUser = {
            id: userDataOfDatabase.id,
            name: userDataOfDatabase.name,
            email: userDataOfDatabase.email,
            roleId: userDataOfDatabase.roleId,
            banned: userDataOfDatabase.banned,
            avatarUrl: userDataOfDatabase.avatarUrl
            
        }
        const alg = 'HS256'
        const jwt = await new SignJWT({userData: jwtPayload})
            .setProtectedHeader({ alg })
            .setExpirationTime('2h')
            .sign(secretTokenSign)

        return jwt
        
    }
}