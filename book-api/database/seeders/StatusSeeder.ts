import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Status from 'App/Models/Status'

export default class extends BaseSeeder {
  public async run () {
    // Write your database queries inside the run method
    await Status.createMany([
      {
        name: 'Processing'
      },
      {
        name: 'Shipped'
      },
      {
        name: 'Delivered'
      },
      {
        name: 'Cancelled'
      }
    ])
  }
}
