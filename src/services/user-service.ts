import _ from 'lodash'
import { NotFound } from 'fejl'

import { User } from '../sequelize'
import RoomService from './room-service'

export default class UserService {
  roomService: RoomService
  constructor({ roomService }) {
    this.roomService = roomService
  }

  async create(data) {
    return await User.create(data)
  }

  async getUser(where) {
    where = _.pickBy(where, _.identity)
      return await User.findOne({ where })
        .then(NotFound.makeAssert('401')) 
  }

  async enterRoom({ userId, roomId }) {
    await this.roomService.get({ id: roomId })
      .then(NotFound.makeAssert('401'))

    const user = await this.getUser({ id: userId })

    return await user.update({ roomId })
  }
}
