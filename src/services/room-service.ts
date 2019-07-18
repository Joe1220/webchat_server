import { Room, Message, User } from '../sequelize'
import _ from 'lodash'
import { NotFound } from 'fejl'

export default class RoomService {
  constructor({  }) { }

  async create(data) {
    return await Room.create(data)
  }

  async gets(where = {}) {
    where = _.pickBy(where, _.identity)
    return await Room.findAll(
      { where, 
        include: [User, { model: Message, include: [User] }] 
      })
  }

  async get(where = {}) {
    where = _.pickBy(where, _.identity)
    return await Room.findOne(
      { where, 
        include: [User, { model: Message, include: [User] }] 
      })
      .then(NotFound.makeAssert(`Room not found`))
  }

  async update(update = { }, id) {
    update = _.pickBy(update, _.identity)
    return await Room.update(update, { where: { id } } )
  }

  async delete(id) {
    return await Room.destroy({ where: { id } })
  }
}
