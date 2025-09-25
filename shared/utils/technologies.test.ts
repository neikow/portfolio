import { describe, expect, it } from 'vitest'
import { filterTechnologies, getTechnologyWithVersion, type TechnologyData } from '#shared/utils/technologies'

const createTechnology = (name: string) => ({
  name,
  altnames: [],
  tags: [],
  color: '',
  aliases: [],
  versions: {
    svg: [],
    font: [],
  },
} satisfies TechnologyData)

const createTechnologyWithVersion = (name: string, version: string) => ({
  name,
  altnames: [],
  tags: [],
  color: '',
  aliases: [],
  versions: {
    svg: [version],
    font: [],
  },
} satisfies TechnologyData)

describe('filterTechnologies', () => {
  it('should return an empty array when given an empty array', () => {
    expect(filterTechnologies([], { selected: [] })).toStrictEqual([])
  })

  it('should return all technologies when no query is provided', () => {
    const technologies = [
      createTechnology('js'), createTechnology('ts'),
    ]
    expect(filterTechnologies(technologies, { selected: [] })).toStrictEqual(technologies)
  })

  it('should limit the number of technologies returned', () => {
    const technologies = [
      createTechnology('js'),
      createTechnology('ts'),
      createTechnology('python'),
    ]
    expect(filterTechnologies(technologies, { limit: 2, selected: [] })).toStrictEqual([
      createTechnology('js'),
      createTechnology('ts'),
    ])
  })

  it('should filter technologies by search term', () => {
    const technologies = [
      createTechnology('JavaScript'),
      createTechnology('TypeScript'),
      createTechnology('Python'),
    ]
    expect(filterTechnologies(technologies, { search: 'script', selected: [] })).toStrictEqual([
      createTechnology('JavaScript'),
      createTechnology('TypeScript'),
    ])
  })

  it('should be case-insensitive when filtering by search term', () => {
    const technologies = [
      createTechnology('JavaScript'),
      createTechnology('TypeScript'),
      createTechnology('Python'),
    ]
    expect(filterTechnologies(technologies, { search: 'SCRIPT', selected: [] })).toStrictEqual([
      createTechnology('JavaScript'),
      createTechnology('TypeScript'),
    ])
  })

  it('should return selected technologies at the beginning of the list, without duplicates', () => {
    const technologies = [
      createTechnology('JavaScript'),
      createTechnology('TypeScript'),
      createTechnology('Python'),
    ]
    expect(filterTechnologies(technologies, { selected: ['Python', 'JavaScript'] })).toStrictEqual([
      createTechnology('JavaScript'),
      createTechnology('Python'),
      createTechnology('TypeScript'),
    ])
  })

  it('should ignore limit for selected technologies', () => {
    const technologies = [
      createTechnology('JavaScript'),
      createTechnology('TypeScript'),
      createTechnology('Python'),
      createTechnology('Ruby'),
    ]
    expect(filterTechnologies(technologies, { selected: ['Python', 'JavaScript'], limit: 1 })).toStrictEqual([
      createTechnology('JavaScript'),
      createTechnology('Python'),
      createTechnology('TypeScript'),
    ])
  })

  it('should handle technologies with icon version correctly', () => {
    const technologies = [
      createTechnologyWithVersion('JavaScript', 'original'),
      createTechnologyWithVersion('TypeScript', 'original'),
      createTechnologyWithVersion('Python', 'original'),
    ]
    expect(filterTechnologies(technologies, {
      selected: [
        getTechnologyWithVersion('Python', 'original'),
        getTechnologyWithVersion('JavaScript', 'original'),
      ],
      limit: 0,
    })).toStrictEqual([
      createTechnologyWithVersion('JavaScript', 'original'),
      createTechnologyWithVersion('Python', 'original'),
    ])
  })
})
