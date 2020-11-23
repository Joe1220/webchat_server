import * as http from 'http'
import koaSwagger from 'koa2-swagger-ui'
import Koa from 'koa'
import swaggerSpec from './swagger'
import cors from '@koa/cors'
import respond from 'koa-respond'
import bodyParser from 'koa-bodyparser'
import compress from 'koa-compress'
import socketio from 'socket.io'
import { scopePerRequest } from 'awilix-koa'
import sequelize from './models'

import { logger } from './logger'
import { configureContainer } from './container'
import { notFoundHandler } from '../middleware/not-found'
import { errorHandler } from '../middleware/error-handler'
import { socketHandler } from '../middleware/socket-handler'
import { registerContext } from '../middleware/register-context'

const corsOptions = {
  origin: 'https://jsh-webchat-client.herokuapp.com/',
  optionsSuccessStatus: 200
}

export async function createServer() {
  logger.debug('Creating server...')
  const app = new Koa()

  await sequelize.sync({ force: false })

  const container = (app['container'] = configureContainer())
  app
    .use(errorHandler)
    .use(compress())
    .use(respond())
    .use(cors(corsOptions))
    .use(bodyParser())
    .use(scopePerRequest(container))
    .use(registerContext)
    .use(
      koaSwagger({
        title: 'web_chat',
        routePrefix: '/swagger',
        swaggerOptions: {
          spec: swaggerSpec,
          showRequestHeaders: false
        }
      })
    )
    .use(notFoundHandler)

  const server = http.createServer(app.callback())

  // socket connect
  const io = socketio.listen(server)

  socketHandler(io)

  server.on('close', () => {
    logger.debug('Server closing, bye!')
  })

  logger.debug('Server created, ready to listen', { scope: 'startup' })
  return server
}
