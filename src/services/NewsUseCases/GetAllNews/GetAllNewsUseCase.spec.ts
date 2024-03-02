import { describe, it, expect } from 'vitest'
import { GetAllNewsUseCase } from './GetAllNewsUseCase'
import { InMemoryNewsRepository } from '../../../repositories/inMemory/InMemoryNewsRepository'

describe('get all news', async () => {
    it('should be able to get all news', async () => {
        const newsRepository = new InMemoryNewsRepository()
        const getAllNewsUseCase = new GetAllNewsUseCase(newsRepository)
        
        for (let i = 0; i < 4; i++) {
            await newsRepository.createNews({
                title: `the ${i} amazing news`,
                description: `a great notice ${i}`,
                content: `today is the day!`,
                userId: `${i}`
            })
        }

        const result = getAllNewsUseCase.execute()
        expect(result).resolves.exist
        expect(result).resolves.toBeTypeOf("object")
    })
})