import { Icons } from './icons'
import { GITHUB_PROFILE, INSTAGRAM_PROFILE, LINKEDIN_PROFILE } from './urls'

export const Socials: {
  label: string
  href: string
  icon: string
  title: string
}[] = [
  { label: 'GitHub', href: GITHUB_PROFILE, icon: Icons.socials.github, title: 'Github - neikow' },
  { label: 'LinkedIn', href: LINKEDIN_PROFILE, icon: Icons.socials.linkedin, title: 'LinkedIn - Vitaly Lysen' },
  { label: 'Instagram', href: INSTAGRAM_PROFILE, icon: Icons.socials.instagram, title: 'Instagram - @vitaly.lyn' },
]
