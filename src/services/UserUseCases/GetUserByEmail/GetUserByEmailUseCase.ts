import { IUserRepository } from "../../../entities/User";

export class GetUserByEmailUseCase {
    constructor(
        private userRepository: IUserRepository
    ){}

    async execute(email: string){
        const userData = await this.userRepository.findUserByEmailOrName(email, undefined)
        if(!userData){
            throw new Error('this user does not exist')
        }
        delete userData.password
        
        return userData
    }
}