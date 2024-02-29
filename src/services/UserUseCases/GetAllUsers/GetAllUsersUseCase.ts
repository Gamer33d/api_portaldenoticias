import { IUser, IUserRepository } from "../../../entities/User";

export class GetAllUsersUseCase{
    constructor(
        private userRepository: IUserRepository
    ){}

    async execute(){
        let arrayOfUsers = await this.userRepository.getAllUsers()
        for (let index = 0; index < arrayOfUsers.length; index++) {
            delete arrayOfUsers[index].password
        }

        return arrayOfUsers
    }

}