import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import UserType from 'App/Models/UserType'

export default class UserTypeSeeder extends BaseSeeder {
  public async run () {
    // Write your database queries inside the run method
    await UserType.createMany([
      {
        name: 'Teacher'
      },
      {
        name: 'Student'
      },
      {
        name: 'Admin'
      }
    ])
  }
}
