import { InMemoryNewsRepository } from "../../repositories/inMemory/InMemoryNewsRepository";
import { CreateNewsPermissions, VerifyRolePermissionsUseCase } from "../RolesUseCases/VerifyRolePermissions/VerifyRolePermissionsUseCase";
import { getRoleUseCase } from "../RolesUseCases/initializer";
import { CreateNewsController } from "./CreateNews/CreateNewsController";
import { CreateNewsUseCase } from "./CreateNews/CreateNewsUseCase";

const newsRepository = new InMemoryNewsRepository()


/*createNews*/
const verifyRolePermission = new VerifyRolePermissionsUseCase(new CreateNewsPermissions(getRoleUseCase))
const createNewsUseCase = new CreateNewsUseCase(newsRepository, verifyRolePermission)
const createNewsController = new CreateNewsController(createNewsUseCase)


export { createNewsController }