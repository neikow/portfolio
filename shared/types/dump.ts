export type BlogPostDump = {
  title: string
  description: string
  tags: string[]
  content: string
  coverImageUrl: string
  slug: string
  published: boolean
  publishedAt: string | null
  createdAt: string
}

export type ExperienceDump = {
  name: string
  role: string
  description: string
  startDate: string
  endDate: string | null
  company: string
  companyUrl: string | null
  logoUrl: string
  technologies: string[]
}

export type LabExperimentDump = {
  name: string
  url: string | null
  repoUrl: string | null
  pictures: string[]
  tags: string[]
  description: string
  createdAt: string
}

export type GalleryImageDump = {
  filename: string
  uploadedAt: string
}

export type SchoolProjectDump = {
  name: string
  description: string
  url: string | null
  repoUrl: string | null
  pdfUrl: string | null
  tags: string[]
}

export type EducationDump = {
  school: string
  degree: string
  field: string
  description: string
  startDate: string
  endDate: string | null
  logoUrl: string
  websiteUrl: string | null
  schoolProjects: SchoolProjectDump[]
}

export type CertificationDump = {
  name: string
  issuer: string
  issuerUrl: string | null
  logoUrl: string | null
  issuedAt: string
  expiresAt: string | null
  credentialUrl: string | null
  description: string | null
}

export type DataDump = {
  version: 1
  exportedAt: string
  blogPosts: BlogPostDump[]
  experiences: ExperienceDump[]
  labExperiments: LabExperimentDump[]
  galleryImages: GalleryImageDump[]
  educations: EducationDump[]
  certifications: CertificationDump[]
}
