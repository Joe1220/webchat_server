import {
  Column, Model, PrimaryKey,
  Table, AllowNull, BelongsTo, ForeignKey, HasMany
} from 'sequelize-typescript'

import { Room } from './Room'
import { Message } from './Message'

@Table
export class User extends Model<User> {
  @PrimaryKey
  @Column
  id: string

  @AllowNull(false)
  @Column
  nickname: string

  @BelongsTo(() => Room)
  room: Room

  @ForeignKey(() => Room)
  roomId: number

  @HasMany(() => Message)
  Messages: Message
}

