import { z } from 'zod'

export type TechnologyWithVersion = `${string}:${string}`

export function getTechnologyWithVersion(techName: string, version: string): TechnologyWithVersion {
  return `${techName}:${version}` as TechnologyWithVersion
}

export function parseTechnologyWithVersion(techMaybeWithVersion: string | TechnologyWithVersion): {
  techName: string
  version: string | null
} {
  const [techName, version] = techMaybeWithVersion.split(':')
  if (!techName) {
    throw new Error(`Invalid technology with version: ${techMaybeWithVersion}`)
  }

  return { techName, version: version ?? null }
}

export type TechnologyData = {
  name: string
  altnames: string[]
  tags: string[]
  color: string
  aliases: string[]
  versions: {
    svg: string[]
    font: string[]
  }
}

export function getTechnologyIconUrl(techName: string, version: string) {
  return `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${techName}/${techName}-${version}.svg`
}

export function getTechnologyWithVersionIconUrl(techWithVersion: string) {
  const { techName, version } = parseTechnologyWithVersion(techWithVersion)
  if (!version) console.error('Missing version for ', techWithVersion)
  return getTechnologyIconUrl(techName.toLowerCase(), version || 'original')
}

export const technologiesQuerySchema = z.object({
  search: z.string().optional(),
  limit: z.coerce.number().min(1).max(100).default(20).optional(),
  selected: z.string().optional().transform(val => val?.split(',').map(s => s.trim()).filter(Boolean)).refine(arr => arr?.length === 0 || arr?.every(s => s.length > 0), {
    message: 'Selected must be a comma-separated list of non-empty strings',
  }).default([]),
})

export type TechnologiesQuery = z.infer<typeof technologiesQuerySchema>

export function filterTechnologies(technologies: TechnologyData[], query: TechnologiesQuery): TechnologyData[] {
  const selectedTechNames = query.selected && query.selected.length > 0
    ? query.selected.map((techMaybeWithVersion) => {
        const { techName } = parseTechnologyWithVersion(techMaybeWithVersion)
        return techName
      })
    : []

  return [
    ...technologies.filter((tech) => {
      if (selectedTechNames.length > 0) {
        return selectedTechNames.includes(tech.name)
      }
      return false
    }),
    ...technologies.filter((tech) => {
      if (query.search) {
        return tech.name.toLowerCase().includes(query.search.toLowerCase())
      }
      if (selectedTechNames.length > 0) {
        return !selectedTechNames.includes(tech.name)
      }

      return true
    }).slice(0, query.limit)]
}
