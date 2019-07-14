import { Room } from '../sequelize'
import _ from 'lodash'

export default class RoomService {
  constructor({  }) { }

  async create(data) {
    return await Room.create(data)
  }

  async gets(where = {}) {
    where = _.pickBy(where, _.identity)
    return await Room.findAll({ where })
  }

  async get(where = {}) {
    where = _.pickBy(where, _.identity)
    return await Room.findOne({ where })
  }

  async update(update = { }, id) {
    update = _.pickBy(update, _.identity)
    return await Room.update(update, { where: { id } } )
  }
}
