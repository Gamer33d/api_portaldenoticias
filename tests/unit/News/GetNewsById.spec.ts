import { InMemoryNewsRepository } from '../../../src/repositories/inMemory/InMemoryNewsRepository'
import { GetNewsByIdUseCase } from '../../../src/services/NewsUseCases/GetNewsById/GetNewsByIdUseCase'
import { describe, it, expect } from 'vitest'

describe('get news by id', async () => {
    it('should be able to get a news by id', async () => {
        const newsRepository = new InMemoryNewsRepository()
        const getNewsByIdUseCase = new GetNewsByIdUseCase(newsRepository)
        

        const newsData = await newsRepository.createNews({
            title: `the amazing news`,
            description: `a great notice `,
            content: `today is the day!`,
            userId: `21`
        })
        

        const result = getNewsByIdUseCase.execute(newsData.id)
        expect(result).resolves.exist
        expect(result).resolves.toBeTypeOf("object")
    })
    it('should not be able to get a news by wrong id', async () => {
        const newsRepository = new InMemoryNewsRepository()
        const getNewsByIdUseCase = new GetNewsByIdUseCase(newsRepository)
        

        await newsRepository.createNews({
            title: `the amazing news`,
            description: `a great notice `,
            content: `today is the day!`,
            userId: `21`
        })
        

        const result = getNewsByIdUseCase.execute(123456)
        expect(result).rejects
        expect(result).rejects.toThrow('this news does not exist.')
    })
})