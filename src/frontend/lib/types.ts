export interface NavLabels {
  home: string
  summary: string
  skills: string
  education: string
  experience: string
  leadership: string
  projects: string
  languages: string
  volunteering: string
  certifications: string
}

export interface MetaData {
  title: string
  description: string
}

export interface HeaderData {
  name: string
  title: string
  email: string
  linkedin: string
  github: string
  devpost: string
}

export interface SummaryData {
  title: string
  content: string
}

export interface SkillCategory {
  name: string
  items: string[]
}

export interface SkillsData {
  title: string
  categories: SkillCategory[]
}

export interface EducationEntry {
  date: string
  degree: string
  institution: string
  bullets: string[]
  logo?: string[]
  links?: EntryLink[]
  images?: string[]
}

export interface EducationData {
  pageTitle: string
  title: string
  entries: EducationEntry[]
}

export interface EntryLink {
  label: string
  url: string
}

export interface ExperienceEntry {
  date: string
  title: string
  company: string
  bullets: string[]
  note?: string
  logo?: string[]
  links?: EntryLink[]
  images?: string[]
}

export interface ExperienceData {
  pageTitle: string
  title: string
  entries: ExperienceEntry[]
}

export interface LeadershipEntry {
  date: string
  title: string
  organization: string
  bullets: string[]
  logo?: string[]
  links?: EntryLink[]
  images?: string[]
}

export interface LeadershipData {
  title: string
  entries: LeadershipEntry[]
}

export interface ProjectEntry {
  date: string
  title: string
  organization: string
  bullets: string[]
  logo?: string[]
  links?: EntryLink[]
  images?: string[]
}

export interface ProjectsData {
  pageTitle: string
  title: string
  entries: ProjectEntry[]
}

export interface LanguageCertificationSkill {
  name: string
  score: number
}

export interface LanguageCertification {
  name: string
  issuer: string
  overallScore: number
  overallLevel: string
  skillsLabel: string
  skills: LanguageCertificationSkill[]
  scaleMin: number
  scaleMax: number
  threshold: number
  thresholdLabel: string
}

export interface LanguageEntry {
  language: string
  level: string
  certification?: LanguageCertification
}

export interface LanguagesData {
  title: string
  entries: LanguageEntry[]
}

export interface VolunteeringEntry {
  date: string
  title: string
  location: string
  description: string
  images?: string[]
}

export interface VolunteeringData {
  title: string
  entries: VolunteeringEntry[]
}

export interface CertificationEntry {
  date: string
  title: string
  issuer: string
  bullets?: string[]
  logo?: string[]
  links?: EntryLink[]
  images?: string[]
}

export interface CertificationsData {
  title: string
  entries: CertificationEntry[]
}

export interface Dictionary {
  meta: MetaData
  nav: NavLabels
  header: HeaderData
  summary: SummaryData
  skills: SkillsData
  education: EducationData
  experience: ExperienceData
  leadership: LeadershipData
  projects: ProjectsData
  languages: LanguagesData
  volunteering: VolunteeringData
  certifications: CertificationsData
}
