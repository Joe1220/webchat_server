import {
  AutoIncrement, Column, Model, ForeignKey,
  PrimaryKey, Table, AllowNull, BelongsTo
} from 'sequelize-typescript'

import { User } from './User'
import { Room } from './Room'

@Table
export class Message extends Model<Message> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number

  @AllowNull(false)
  @Column
  message: string

  @ForeignKey(() => User)
  @Column
  userId: string

  @ForeignKey(() => Room)
  @Column
  roomId: number
  
  @BelongsTo(() => User)
  user: User
  
  @BelongsTo(() => Room)
  room: Room
}

