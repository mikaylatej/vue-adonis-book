import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CreateBookValidator from 'App/Validators/CreateBookValidator'
import Book
 from 'App/Models/Book'
import UpdateBookValidator from 'App/Validators/UpdateBookValidator'
export default class BooksController {
    public async index() {
        // const books = await Book.all()
        const books = await Book.query()
        .preload('user')
        .preload('category')

        return books
    }

    public async store({ request, auth }:HttpContextContract) {
        const validatedData = await request.validate(CreateBookValidator)

        const book = await auth.user?.related('books').create(validatedData)

        // fetch user that created the book and category it belongs to
        await book?.preload('user')
        await book?.preload('category')
        return book
    }

    public async show ({ params }:HttpContextContract) {
        const book = await Book.query()
            .where('id', params.id)
            .preload('user')
            .preload('category')
            .firstOrFail()
        
        return book
    }

    public async update ({ request, params }:HttpContextContract) {
        const book = await Book.findOrFail(params.id)   // fetch book to update

        const validatedData = await request.validate(UpdateBookValidator)

        // update book
        book.merge(validatedData)
        await book.save()   // pass changes to db

        // fetch user that created the book and category it belongs to
        await book.preload('user')
        await book.preload('category')

        return book
    }

    public async destroy({ params }:HttpContextContract) {
        const book = await Book.findOrFail(params.id)      // fetch thread to delete

        return book.delete()
    }
}
