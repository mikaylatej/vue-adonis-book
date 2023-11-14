import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { column, beforeSave, BaseModel, hasMany, HasMany, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import Book from './Book'
import UserType from './UserType'
import Order from './Order'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column() 
  public name: string

  @column() 
  public location: string

  @column() 
  public userType: string

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public rememberMeToken: string | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword (user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  @hasMany(() => Book) 
  public books: HasMany<typeof Book>

  @belongsTo(() => UserType)
  public userTypes: BelongsTo<typeof UserType>

  @hasMany(() => Order) 
  public order: HasMany<typeof Order>
}
