import { IUser, ICreateUserRequestDTO, IUserRepository, IEditUserRequestDTO } from "../../entities/User";
import { randomUUID } from 'node:crypto'

export class InMemoryUserRepository implements IUserRepository{
    private users: IUser[] = []

    async getAllUsers(): Promise<IUser[]> {
        return this.users
    }

    async createUser(userData: ICreateUserRequestDTO): Promise<IUser> {
        const { name, email, password, roleId, avatarUrl } = userData
        const id = randomUUID()
        const isUserBanned = false
        const user: IUser = {
            id,
            name,
            email,
            password,
            roleId: roleId??null,
            avatarUrl: avatarUrl??null,
            banned: isUserBanned
        }

        this.users.push(user)
        return user

    }
    
    async findUserByEmailOrName(email: string | undefined, name: string | undefined): Promise<IUser | null> {
        const user = this.users.find(user => user.email == email || user.name == name) || null
        return user
        
    }

    async findUserById(id: string): Promise<IUser | null> {
        const user = this.users.find(user => user.id == id) || null
        return user
    }

    async editUser(userEditData: IEditUserRequestDTO, idOfUserToEdit: string): Promise<IUser> {
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

    async deleteUserById(id: string): Promise<boolean> {
        const userIndex = this.users.findIndex(user => user.id === id)
        this.users.splice(userIndex, 1)
        return true
        

    }
}