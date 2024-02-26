import { IUser, ICreateUserRequestDTO, IUserRepository } from "../../entities/User";
import { randomUUID } from 'node:crypto'

export class InMemoryUserRepository implements IUserRepository{
    private users: IUser[] = []

    async createUser(userData: ICreateUserRequestDTO): Promise<IUser> {
        const { name, email, password, roleId} = userData
        const id = randomUUID()
        const isUserBanned = false
        const user: IUser = {
            id,
            name,
            email,
            password,
            roleId,
            banned: isUserBanned
        }

        this.users.push(user)
        return user

    }
    
    async findUserByEmailOrName(email: string, name: string): Promise<IUser | null> {
        const user = this.users.find(user => user.email == email || user.name == name) || null
        return user
        
    }
}