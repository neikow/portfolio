import type { Experience } from '#shared/schemas/experience'
import slugify from 'slugify'

export function generateExperienceHtmlId(experience: Experience) {
  return `${slugify(experience.name, { lower: true })}-${experience.id}`
}
