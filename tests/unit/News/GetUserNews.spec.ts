import { InMemoryNewsRepository } from "../../../src/repositories/inMemory/InMemoryNewsRepository"
import { GetUserNewsUseCase } from "../../../src/services/NewsUseCases/GetUserNews/GetUserNewsUseCase"
import { describe, it, expect } from "vitest"

describe("get user's news", async () => {
    it("should be able to get user's news", async () => {
        const newsRepository = new InMemoryNewsRepository()
        const getUserNewsUseCase = new GetUserNewsUseCase(newsRepository)

        for (let i = 0; i < 3; i++) {
            await newsRepository.createNews({
                title: `news ${i}`,
                content: `content ${i}`,
                description: `descriptions ${i}`,
                userId: '551'
            })
        }

        const result = getUserNewsUseCase.execute('551')
        expect(result).resolves.exist
        expect((await result).length).toEqual(3)
    })

    it('should be able get news with incorrect id and return []', async() => {
        const newsRepository = new InMemoryNewsRepository()
        const getUserNewsUseCase = new GetUserNewsUseCase(newsRepository)

        const result = getUserNewsUseCase.execute('551')
        expect(result).resolves.exist
        expect((await result).length).toEqual(0)
    })
})