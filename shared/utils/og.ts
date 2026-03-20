import { SITE_URL } from '#shared/consts/urls'

function getOgImageUrl(path: string) {
  const normalizedPath = path
    .split('/')
    .filter(Boolean)
    .join('/')

  return `${SITE_URL}/og/${normalizedPath}.png`
}

export {
  getOgImageUrl,
}
