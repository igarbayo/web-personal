from typing import Dict, List, Optional
from pydantic import BaseModel, Field


class NavLabels(BaseModel):
    home: str
    summary: str
    skills: str
    education: str
    experience: str
    leadership: str
    projects: str
    languages: str
    volunteering: str
    certifications: str


class MetaData(BaseModel):
    title: str
    description: str


class HeaderData(BaseModel):
    name: str
    title: str
    email: str
    linkedin: str
    github: str
    devpost: str


class SummaryData(BaseModel):
    title: str
    content: str


class SkillCategory(BaseModel):
    name: str
    items: List[str] = Field(default_factory=list)


class SkillsData(BaseModel):
    title: str
    categories: List[SkillCategory] = Field(default_factory=list)


class EntryLink(BaseModel):
    label: str
    url: str


class EducationEntry(BaseModel):
    date: str
    degree: str
    institution: str
    bullets: List[str] = Field(default_factory=list)
    logo: Optional[List[str]] = None
    links: Optional[List[EntryLink]] = None
    images: Optional[List[str]] = None


class EducationData(BaseModel):
    pageTitle: str
    title: str
    entries: List[EducationEntry] = Field(default_factory=list)


class ExperienceEntry(BaseModel):
    date: str
    title: str
    company: str
    bullets: List[str] = Field(default_factory=list)
    note: Optional[str] = None
    logo: Optional[List[str]] = None
    logoDark: Optional[List[str]] = None
    links: Optional[List[EntryLink]] = None
    images: Optional[List[str]] = None


class ExperienceData(BaseModel):
    pageTitle: str
    title: str
    entries: List[ExperienceEntry] = Field(default_factory=list)


class LeadershipEntry(BaseModel):
    date: str
    title: str
    organization: Optional[str] = ""
    bullets: List[str] = Field(default_factory=list)
    logo: Optional[List[str]] = None
    links: Optional[List[EntryLink]] = None
    images: Optional[List[str]] = None


class LeadershipData(BaseModel):
    title: str
    entries: List[LeadershipEntry] = Field(default_factory=list)


class ProjectEntry(BaseModel):
    date: str
    title: str
    organization: Optional[str] = None
    bullets: List[str] = Field(default_factory=list)
    logo: Optional[List[str]] = None
    logoDark: Optional[List[str]] = None
    logoBorderColor: Optional[str] = None
    links: Optional[List[EntryLink]] = None
    images: Optional[List[str]] = None


class ProjectsData(BaseModel):
    pageTitle: str
    title: str
    entries: List[ProjectEntry] = Field(default_factory=list)


class LanguageCertificationSkill(BaseModel):
    name: str
    score: int


class LanguageCertification(BaseModel):
    name: str
    issuer: str
    overallScore: int
    overallLevel: str
    skillsLabel: str
    skills: List[LanguageCertificationSkill] = Field(default_factory=list)
    scaleMin: int
    scaleMax: int
    threshold: int
    thresholdLabel: str


class LanguageEntry(BaseModel):
    language: str
    level: str
    certification: Optional[LanguageCertification] = None


class LanguagesData(BaseModel):
    title: str
    entries: List[LanguageEntry] = Field(default_factory=list)


class VolunteeringEntry(BaseModel):
    date: str
    title: str
    location: str
    description: str
    images: Optional[List[str]] = None


class VolunteeringData(BaseModel):
    title: str
    entries: List[VolunteeringEntry] = Field(default_factory=list)


class CertificationEntry(BaseModel):
    date: str
    title: str
    issuer: str
    bullets: Optional[List[str]] = None
    logo: Optional[List[str]] = None
    links: Optional[List[EntryLink]] = None
    images: Optional[List[str]] = None


class CertificationsData(BaseModel):
    title: str
    entries: List[CertificationEntry] = Field(default_factory=list)


class FooterData(BaseModel):
    repo: str


class DictionaryModel(BaseModel):
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
    footer: FooterData


class DictionariesBundle(BaseModel):
    en: DictionaryModel
    es: DictionaryModel
    gl: DictionaryModel


class SaveDictionariesRequest(BaseModel):
    dictionaries: DictionariesBundle
    commit_message: Optional[str] = "cms: update dictionaries content"


class SaveSectionRequest(BaseModel):
    section: str = Field(..., description="Nombre de la sección: meta, nav, header, summary, skills, education, experience, leadership, projects, languages, volunteering, certifications, footer")
    data_en: dict
    data_es: dict
    data_gl: dict
    commit_message: Optional[str] = None


class ContentSaveResponse(BaseModel):
    status: str
    message: str
    details: Optional[dict] = None
