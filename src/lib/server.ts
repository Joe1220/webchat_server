import * as http from 'http'
import koaSwagger from 'koa2-swagger-ui'
import Koa from 'koa'
import swaggerSpec from './swagger'
import cors from '@koa/cors'
import respond from 'koa-respond'
import bodyParser from 'koa-bodyparser'
import compress from 'koa-compress'
import { scopePerRequest, loadControllers } from 'awilix-koa'
import sequelize from './models'

import { logger } from './logger'
import { configureContainer } from './container'
import { notFoundHandler } from '../middleware/not-found'
import { errorHandler } from '../middleware/error-handler'
import { registerContext } from '../middleware/register-context'

export async function createServer() {
  logger.debug('Creating server...')
  const app = new Koa()

  await sequelize.sync({force: false})

  const container = (app['container'] = configureContainer())
  app
    .use(errorHandler)
    .use(compress())
    .use(respond())
    .use(cors())
    .use(bodyParser())
    .use(scopePerRequest(container))
    .use(registerContext)
    .use(
      koaSwagger({
        title: 'coworksys',
        routePrefix: '/swagger',
        swaggerOptions: {
          spec: swaggerSpec,
          showRequestHeaders: false
        }
      })
    )
    .use(loadControllers('../routes/*.js', { cwd: __dirname }))
    .use(notFoundHandler)

  const server = http.createServer(app.callback())

  server.on('close', () => {
    logger.debug('Server closing, bye!')
  })

  logger.debug('Server created, ready to listen', { scope: 'startup' })
  return server
}
