import { ICreateUserRequestDTO, IEditUserRequestDTO, IUser, IUserRepository } from "../../entities/User";
import { prisma } from "../../infrastructure/db/PrismaClient";

export class PrismaUserRepository implements IUserRepository{

    async getAllUsers(): Promise<IUser[]> {
        try {
            const users = await prisma.users.findMany()
            return users
            
        } catch (error) {
           throw error 
        }
    }

    async findUserById(id: string): Promise<IUser | null> {
        try {
            const user = await prisma.users.findUnique({
                where: {
                    id
                }
            })
    
            return user
            
        } catch (error) {
            throw error
        }
    }

    async findUserByEmailOrName(email: string | undefined, name: string | undefined): Promise<IUser | null> {
        try {
            const user = await prisma.users.findFirst({
                where: {
                    OR: [
                        {email},
                        {name}
                    ]
                }
            })
            
            return user
            
        } catch (error) {
            throw error
        }
    }

    async createUser(data: ICreateUserRequestDTO): Promise<IUser> {
        try{

            const userCreated: IUser = await prisma.users.create({
                data: {
                    ...data,
                    banned: false,
                }
            })
            
            return userCreated
        }catch(error){
            throw error
        }
    }

    async editUser(data: IEditUserRequestDTO, id: string): Promise<IUser> {
        try {
            const userEdited = await prisma.users.update({
                where: {
                    id
                },
                data
            })
            
            return userEdited
        } catch (error) {
            throw error
        }

    }

    async deleteUserById(id: string): Promise<boolean> {
        try {
            await prisma.users.delete({
                where: {
                    id
                }
            })

            return true
            
        } catch (error) {
            throw error
        }
    }
}