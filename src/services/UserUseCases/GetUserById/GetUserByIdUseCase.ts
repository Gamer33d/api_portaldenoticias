import { IUserRepository } from "../../../entities/User";

export class GetUserByIdUseCase {
    constructor(
        private userRepository: IUserRepository
    ){}

    async execute(id: string){
        const userData = await this.userRepository.findUserById(id)
        if(!userData){
            throw new Error('this user does not exist')
        }
        delete userData.password
        
        return userData
    }
}