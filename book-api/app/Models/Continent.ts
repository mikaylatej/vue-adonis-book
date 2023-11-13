import { DateTime } from 'luxon'
import { BaseModel, HasMany, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Book from './Book'

export default class Continent extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string 

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Book)
  public books: HasMany<typeof Book>
}
