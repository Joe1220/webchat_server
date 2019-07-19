import path from 'path'
import { Sequelize } from 'sequelize-typescript'
import { env } from './env'

const sequelize =  new Sequelize({
  operatorsAliases: Sequelize.Op as any,
  database: env.DB_DATABASE,
  host: env.DB_HOST,
  dialect: env.DB_DIARECT,
  username: env.DB_USERNAME,
  password: '' + env.DB_PASSWORD,
  port: env.DB_PORT,
  modelPaths: [path.join(__dirname, '../sequelize/models')],
  define: {
    timestamps: true,
    paranoid: true,
    charset: 'utf8',
    dialectOptions: { collate: 'utf8_general_ci' }
  }
})

export default sequelize
