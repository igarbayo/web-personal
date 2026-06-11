import {
  SiOpenjdk,
  SiPython,
  SiJavascript,
  SiHtml5,
  SiCss,
  SiNestjs,
  SiAngular,
  SiNextdotjs,
  SiPostgresql,
  SiMongodb,
  SiGnubash,
  SiDocker,
  SiKubernetes,
  SiJenkins,
  SiRabbitmq,
  SiApachekafka,
} from 'react-icons/si'
import type { IconType } from 'react-icons'

const iconMap: Record<string, IconType> = {
  Java: SiOpenjdk,
  Python: SiPython,
  JavaScript: SiJavascript,
  HTML: SiHtml5,
  CSS: SiCss,
  NestJS: SiNestjs,
  Angular: SiAngular,
  'Next.js': SiNextdotjs,
  PostgreSQL: SiPostgresql,
  MongoDB: SiMongodb,
  Bash: SiGnubash,
  Docker: SiDocker,
  Kubernetes: SiKubernetes,
  Jenkins: SiJenkins,
  RabbitMQ: SiRabbitmq,
  Kafka: SiApachekafka,
}

export function getSkillIcon(label: string): IconType | null {
  return iconMap[label] ?? null
}
