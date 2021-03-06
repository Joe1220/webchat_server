import swaggerJSDoc from 'swagger-jsdoc'
import path from 'path'

const swaggerDefinition = {
  info: {
    title: 'WEBCHAT API',
    version: '1.0.0',
    description: 'WEBCHAT API',
  },
  basePath: '/'
}

const options = {
  swaggerDefinition,
  apis: [path.join(__dirname, '../../src/routes/*-api.*')],
}

const swaggerSpec =  swaggerJSDoc(options)

export default swaggerSpec