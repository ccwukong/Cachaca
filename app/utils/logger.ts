import dotenv from 'dotenv'
dotenv.config()

export async function log(message: {
  source: string
  message: unknown
  type: string
  level?: string
  timestamp: number
}) {
  console.log(message)
}

export enum LogType {
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
}

export enum LogLevel {
  NORMAL = 'NORMAL',
  URGENT = 'URGENT',
  CRITICAL = 'CRITICAL',
}
