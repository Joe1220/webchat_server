import _ from 'lodash'

import { Message } from '../sequelize'
import RoomService from './room-service'

export default class MessageService {
  roomService: RoomService
  constructor({ roomService }) {
    this.roomService = roomService
  }

  async create(data) {
    return await Message.create(data)
  }

  async delete(id) {
    return await Message.destroy({ where: { id } })
  }
}
 