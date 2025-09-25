import { getTechnologyIconUrl } from '#shared/utils/technologies'

const getRawTechnologies = defineCachedFunction(async () => {
  const technologiesResponse = await fetch('https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.json')

  if (!technologiesResponse.ok) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to fetch technologies' })
  }

  return await technologiesResponse.json() as TechnologyData[]
}, {
  maxAge: 60 * 60 * 24,
  swr: true,
})

function getTechIconVersion(tech: TechnologyData) {
  return tech.versions.svg[0] || 'original'
}

export default defineEventHandler(async (event) => {
  await requireUserSession(event)

  const { data: query, error, success } = await getValidatedQuery(event, technologiesQuerySchema.safeParse)

  if (error || !success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid query parameters' })
  }

  const technologies = await getRawTechnologies()

  return filterTechnologies(technologies, query).map(tech => ({
    name: tech.name,
    version: getTechIconVersion(tech),
    src: getTechnologyIconUrl(tech.name.toLowerCase(), getTechIconVersion(tech)),
  }))
})
