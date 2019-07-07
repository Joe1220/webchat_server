import yenv from 'yenv'
import { logger } from './logger'

process.env.NODE_ENV = process.env.NODE_ENV || 'development'

export const env = yenv('env.yaml', {
  logBeforeThrow: message => logger.error(message)
})
