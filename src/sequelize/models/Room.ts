import {
  AutoIncrement, Column, Model, 
  PrimaryKey, Table, AllowNull, HasMany
} from 'sequelize-typescript'

import { User } from './User'
import { Message } from './Message'

@Table
export class Room extends Model<Room> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number

  @AllowNull(false)
  @Column
  title: string
  
  @HasMany(() => User)
  users: User[]

  @HasMany(() => Message)
  messages: Message[]
}

