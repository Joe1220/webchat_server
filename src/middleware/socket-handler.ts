import RoomService from '../services/room-service'
import UserService from '../services/user-service'

export function socketHandler(io) {
  return io.on('connection', (socket) => {
    // connect services
    const roomService = new RoomService({})
    const userService = new UserService({ roomService })

    socket.on('login', async({ nickname }) => {
      await userService.create({ id: socket.id, nickname })
      socket.emit('login', { id: socket.id, nickname })
    })

    socket.on('create_room', async (room) => {
      const makedRoom = await roomService.create(room)
      
      socket.join(makedRoom.id, () => {
        socket.emit('in_room', makedRoom)
      })
      socket.emit('get_rooms', await roomService.gets())
    })

    // id는 room id
    socket.on('enter_room', async ({ id, user }) => {
      await userService.enterRoom({ userId: user.id, roomId: id })

      const inRoom = await roomService.get({ id })
      socket.join(id, () => {
        socket.emit('in_room', inRoom)
      })
      socket.emit('get_rooms', await roomService.gets())
    })

    socket.on('get_rooms',async () => {
      const rooms = await roomService.gets()
      socket.emit('get_rooms', rooms)
    })

    socket.on('disconnect', () => {
      console.log('client disconnect...', socket.handshake.query)
    })
  })

}
