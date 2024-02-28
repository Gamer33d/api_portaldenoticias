import { IUser, ICreateUserRequestDTO, IUserRepository, IEditUserRequestDTO } from "../../entities/User";
import { randomUUID } from 'node:crypto'

export class InMemoryUserRepository implements IUserRepository{
    private users: IUser[] = []

    async createUser(userData: ICreateUserRequestDTO): Promise<IUser> {
        const { name, email, password, roleId, avatarUrl } = userData
        const id = randomUUID()
        const isUserBanned = false
        const user: IUser = {
            id,
            name,
            email,
            password,
            roleId,
            avatarUrl,
            banned: isUserBanned
        }

        this.users.push(user)
        return user

    }
    
    async findUserByEmailOrName(email: string, name: string): Promise<IUser | undefined> {
        const user = this.users.find(user => user.email == email || user.name == name) || undefined
        return user
        
    }

    async findUserById(id: string): Promise<IUser | undefined> {
        const user = this.users.find(user => user.id == id) || undefined
        return user
    }

    async editUser(userEditData: IEditUserRequestDTO, idOfUserToEdit: string): Promise<IUser | undefined> {
        const indexOfUser = this.users.findIndex(user => user.id == idOfUserToEdit)
        const userInDb = this.users[indexOfUser]
        const payloadEditUser: IUser = {
            id: userInDb.id,
            name: userEditData.name ?? userInDb.name,
            email: userEditData.email ?? userInDb.email,
            password: userEditData.password ?? userInDb.password,
            avatarUrl: userEditData.avatarUrl ?? userInDb.avatarUrl,
            roleId: userEditData.roleId ?? userInDb.roleId,
            banned: userEditData.banned ?? userInDb.banned
            
        }

        this.users[indexOfUser] = payloadEditUser
        return payloadEditUser
        
    }
}