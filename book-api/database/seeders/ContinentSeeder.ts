import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Continent from 'App/Models/Continent'

export default class ContinentSeeder extends BaseSeeder {
  public async run () {
    // Write your database queries inside the run method
    await Continent.createMany([
      {
        name: 'Africa'
      },
      {
        name: 'Asia'
      },
      {
        name: 'Australia'
      },
      {
        name: 'Europe'
      },
      {
        name: 'North America'
      },
      {
        name: 'South America'
      }
    ])
  }
}
