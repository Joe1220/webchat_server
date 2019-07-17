import RoomService from '../services/room-service'
import UserService from '../services/user-service'
const LOBBY_ROOM_ID = 'LOBBY'

export function socketHandler(io) {
  return io.on('connection', (socket) => {
    // connect services
    const roomService = new RoomService({})
    const userService = new UserService({ roomService })

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

    socket.on('leave_lobby', () => {
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
      let rooms = await roomService.gets()

      if(inRoom.users.length < 1) {
        await roomService.delete(id)
        rooms = await roomService.gets()
      }

      socket.leave(id, () => {
        socket.to(id).emit('in_room', inRoom)
        socket.to(LOBBY_ROOM_ID).emit('get_rooms', rooms)
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
