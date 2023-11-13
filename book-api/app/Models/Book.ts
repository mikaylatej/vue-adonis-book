import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Category from './Category'
import User from './User'
import Continent from './Continent'

export default class Book extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column() 
  public userId: number

  @column() 
  public categoryId: number

  @column() 
  public title: string

  @column()
  public price: number

  @column() 
  public author: string

  @column() 
  public location: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Category)
  public category: BelongsTo<typeof Category>

  @belongsTo(() => Continent)
  public continent: BelongsTo<typeof Continent>

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>
}
