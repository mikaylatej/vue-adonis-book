import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Books from 'App/Models/Book'

export default class BooksSeeder extends BaseSeeder {
  public async run () {
    // Write your database queries inside the run method

    await Books.createMany([
      {
        title: 'Book 1',
        category: 'Teacher Book',
      },
      {
        title: 'Book 2',
        category: 'Student Book',
      },
    ])
  }
}
