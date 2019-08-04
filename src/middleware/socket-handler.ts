import moment from 'moment'
import { getLastTwelveMonth, getListFromMonths } from '../utils/date'

import { sequelize } from '../sequelize'
import RoomService from '../services/room-service'
import UserService from '../services/user-service'
import MessageService from '../services/message-service'

const LOBBY_ROOM_ID = 'LOBBY'

export function socketHandler(io) {
  return io.on('connection', (socket) => {
    // connect services
    const roomService = new RoomService({})
    const userService = new UserService({ roomService })
    const messageService = new MessageService({ roomService })

    // 12개월동안 가입된 유저 불러오기
    socket.on('get_users', async() => {
      // 12개월 기준으로 가입된 유저 불러오기
      const firstDay = getLastTwelveMonth()
      const createdAt = { [sequelize.Op.gte]: moment(firstDay).utc().startOf('day') }
      const existUsers = await userService.gets({ createdAt })
   
      const userListFromMonths = getListFromMonths(existUsers)
      socket.emit('get_users', userListFromMonths)
    })

    // 12개월동안 메세지의 양
    socket.on('get_messages', async() => {
      // 12개월 기준으로 가입된 유저 불러오기
      const firstDay = getLastTwelveMonth()
      const createdAt = { [sequelize.Op.gte]: moment(firstDay).utc().startOf('day') }
      const existMessages = await messageService.gets({ createdAt })
    
      const messageListFromMonths = getListFromMonths(existMessages)
      socket.emit('get_messages', messageListFromMonths)
    })

    socket.on('login', async({ nickname }) => {
      await userService.create({ id: socket.id, nickname })
      socket.emit('login', { id: socket.id, nickname })
    })

    socket.on('enter_lobby', async () => {
      const rooms = await roomService.gets()

      socket.join(LOBBY_ROOM_ID, async () => {
        socket.emit('get_rooms', rooms)
      })
    })

    socket.on('leave_lobby', async ({ id }) => {
      await userService.delete(id)
      socket.leave(LOBBY_ROOM_ID)
    })

    socket.on('create_room', async (room) => {
      const makedRoom = await roomService.create(room)
      const rooms = await roomService.gets()
      
      socket.join(makedRoom.id, () => {
        socket.emit('in_room', makedRoom)
        socket.to(LOBBY_ROOM_ID).emit('get_rooms', rooms)
      })
    })

    // id는 room id
    socket.on('enter_room', async ({ id, user }) => {
      await userService.enterRoom({ userId: user.id, roomId: id })
        .catch(e => {
          socket.emit('not_room', e)
        })

      const inRoom = await roomService.get({ id })

      const rooms = await roomService.gets()

      socket.join(id, () => {
        socket.emit('in_room', inRoom)
        socket.to(id).emit('in_room', inRoom)
        socket.to(LOBBY_ROOM_ID).emit('get_rooms', rooms)
      })
    })

    // id는 room id
    socket.on('leave_room', async ({ id, user }) => {
      await userService.leaveRoom({ userId: user.id, roomId: id })

      const inRoom = await roomService.get({ id })

      // 방 나갈 때 유저 0명일 시 방 삭제(메세지는 그대로 기록)
      await roomService.delete(id)

      socket.leave(id, async () => {
        socket.to(id).emit('in_room', inRoom)
        socket.to(LOBBY_ROOM_ID).emit('get_rooms', await roomService.gets())
      })
    })

    socket.on('message', async({ userId, roomId, message }) => {
      await messageService.create({
        message,
        userId, 
        roomId
      })

      const inRoom = await roomService.get({ id: roomId })

      socket.emit('in_room', inRoom)
      socket.to(roomId).emit('in_room', inRoom)
    })

    socket.on('disconnect', () => {
      console.log('client disconnect...', socket.handshake.query)
    })
  })

}
