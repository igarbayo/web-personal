import {
  SiC,
  SiR,
  SiFortran,
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
  SiRedis,
  SiGnubash,
  SiDocker,
  SiKubernetes,
  SiJenkins,
  SiRabbitmq,
  SiApachekafka,
  SiMqtt,
} from 'react-icons/si'
import { FaDatabase } from 'react-icons/fa'
import type { IconType } from 'react-icons'

const iconMap: Record<string, IconType> = {
  C: SiC,
  R: SiR,
  SQL: FaDatabase,
  Fortran: SiFortran,
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
  Redis: SiRedis,
  Bash: SiGnubash,
  Docker: SiDocker,
  Kubernetes: SiKubernetes,
  Jenkins: SiJenkins,
  RabbitMQ: SiRabbitmq,
  Kafka: SiApachekafka,
  MQTT: SiMqtt,
}

export function getSkillIcon(label: string): IconType | null {
  return iconMap[label] ?? null
}
