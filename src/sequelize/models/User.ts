import {
  AutoIncrement, Column, Model, PrimaryKey,
  Table, AllowNull
} from 'sequelize-typescript'

@Table
export class User extends Model<User> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number

  @AllowNull(false)
  @Column
  name: string
}

