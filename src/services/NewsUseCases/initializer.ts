import { InMemoryNewsRepository } from "../../repositories/inMemory/InMemoryNewsRepository";
import { PrismaNewsRepository } from "../../repositories/prisma/PrismaNewsRepository";
import { CreateNewsPermissions, DeleteNewsPermissions, EditNewsPermissions, VerifyRolePermissionsUseCase } from "../RolesUseCases/VerifyRolePermissions/VerifyRolePermissionsUseCase";
import { getRoleUseCase } from "../RolesUseCases/initializer";
import { CreateNewsController } from "./CreateNews/CreateNewsController";
import { CreateNewsUseCase } from "./CreateNews/CreateNewsUseCase";
import { DeleteNewsController } from "./DeleteNews/DeleteNewsController";
import { DeleteNewsUseCase } from "./DeleteNews/DeleteNewsUseCase";
import { EditNewsController } from "./EditNews/EditNewsController";
import { EditNewsUseCase } from "./EditNews/EditNewsUseCase";
import { GetAllNewsController } from "./GetAllNews/GetAllNewsController";
import { GetAllNewsUseCase } from "./GetAllNews/GetAllNewsUseCase";
import { GetNewsByIdController } from "./GetNewsById/GetNewsByIdController";
import { GetNewsByIdUseCase } from "./GetNewsById/GetNewsByIdUseCase";
import { GetUserNewsController } from "./GetUserNews/GetUserNewsController";
import { GetUserNewsUseCase } from "./GetUserNews/GetUserNewsUseCase";

const newsRepository = new PrismaNewsRepository()

/*createNews*/
const verifyCreatePermissions = new VerifyRolePermissionsUseCase(new CreateNewsPermissions(), getRoleUseCase)
const createNewsUseCase = new CreateNewsUseCase(newsRepository, verifyCreatePermissions)
const createNewsController = new CreateNewsController(createNewsUseCase)

/*editNews*/
const verifyEditPermissions = new VerifyRolePermissionsUseCase(new EditNewsPermissions(), getRoleUseCase)
const editNewsUseCase = new EditNewsUseCase(newsRepository, verifyEditPermissions)
const editNewsController = new EditNewsController(editNewsUseCase)

/*get all news*/
const getAllNewsUseCase = new GetAllNewsUseCase(newsRepository)
const getAllNewsController = new GetAllNewsController(getAllNewsUseCase)

/*get news by id*/
const getNewsByIdUseCase = new GetNewsByIdUseCase(newsRepository)
const getNewsByIdController = new GetNewsByIdController(getNewsByIdUseCase) 

/*get news by user id*/
const getUserNewsUseCase = new GetUserNewsUseCase(newsRepository)
const getUserNewsController = new GetUserNewsController(getUserNewsUseCase)

/*delete news */
const verifyDeletePermissions = new VerifyRolePermissionsUseCase(new DeleteNewsPermissions(), getRoleUseCase)
const deleteNewsUseCase = new DeleteNewsUseCase(newsRepository, verifyDeletePermissions)
const deleteNewsController = new DeleteNewsController(deleteNewsUseCase)

export { createNewsController, editNewsController, getAllNewsController, getNewsByIdController, getUserNewsController, deleteNewsController }