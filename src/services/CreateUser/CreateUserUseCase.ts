import { IUser, ICreateUserRequestDTO, IUserRepository } from "../../entities/User";
import bcrypt from 'bcrypt'

export class CreateUserUseCase{
    constructor(
        private userRepository: IUserRepository
    ){}

    async execute(userToBeCreated: ICreateUserRequestDTO, userLogged: IUser | null): Promise<IUser>{
        let { name, email, password, roleId} = userToBeCreated
        if(!roleId) { 
            roleId = 10
        }
        
        //verificar se existe usuario com aquele email ou usuario
        const userAlreadyExists = await this.userRepository.findUserByEmailOrName(email, name)
        if(userAlreadyExists){
            throw new Error('this user already exists')
        }


        if(roleId<= 3){
            if(!userLogged || userLogged.roleId != 1){
                throw new Error("you dont have permission to create this user.")
            }
        }
        
        if(userLogged?.banned){
            throw new Error("you're banned.")
        }

        const hashPassword = bcrypt.hashSync(password, 10)

        const createdUser = await this.userRepository.createUser({
            name,
            email,
            password: hashPassword,
            roleId
        })

        return createdUser;

    }
}