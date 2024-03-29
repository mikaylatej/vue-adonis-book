import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CreateBookValidator from 'App/Validators/CreateBookValidator'
import Book from 'App/Models/Book'
import UpdateBookValidator from 'App/Validators/UpdateBookValidator'
import UnauthorizedException from 'App/Exceptions/UnauthorizedException'
import Order from 'App/Models/Order'

export default class BooksController {

    // admin and teacher can access all books
    public async showAllBooks({ request, auth }: HttpContextContract) {
        const location = request.input('location')
        const access_type = request.input('access_type')
        let query = Book.query().clone()

        const user = auth.user?.toJSON()
        if (request.all().access === 'no' && user?.user_type === 'Student') {
            console.log('user loc: ' + user?.location)
            query = query.whereIn('access_type', ['Student', 'All'])
                      .andWhere('location', user?.location)
                      .clone()
        }
        if (location != null && access_type != null) {
            query = query
                .where('location', location)
                .andWhere('access_type', access_type)
                .clone()
        } else if (location != null && access_type == null) {
            query = query
                .where('location', location)
                .clone()
        } else if (location == null && access_type != null) {
            query = query
                .where('access_type', access_type)
                .clone()
        }
        return query
    }

    public async store({ request, auth }: HttpContextContract) {
        console.log(request)
        const validatedData = await request.validate(CreateBookValidator)
        // user type must be Admin to create book

        if (auth.user?.userType !== 'Admin' && request.all().access === 'no') {
            throw new UnauthorizedException('This user is not authorized to create a book record.')
        } else {
            const book = await auth.user?.related('books').create(validatedData)
            console.log(auth.user?.toJSON())    // to extract user info
            // fetch user that created the book and category it belongs to
            await book?.load('user')
            return book
        }
    }

    public async showBook({ params, auth, request }: HttpContextContract) {
        const user = auth.user?.toJSON()
        const book = await Book.findOrFail(params.id)
        const order = await Order.findBy('book_id', params.id)

        console.log(order == null)
        if (user?.user_type === 'Student'
            && (book.accessType === 'Teacher' || user?.location !== book.location)
            && order == null
            && request.all().access === 'no'
        ) {
            throw new UnauthorizedException('This user is not authorized to view this book record.')
        }
        const bookList = await Book.query()
            .where('id', params.id)
            .preload('user')
            .firstOrFail()

        return bookList
    }

    public async update({ request, auth }: HttpContextContract) {
        // fetch book to update
        console.log('update book')
        console.log(request.all().access)
        const validatedData = await request.validate(UpdateBookValidator)
        const book_id = request.input('book_id')
        const book = await Book.findOrFail(book_id)

        if (auth.user?.userType !== 'Admin' && request.all().access === 'no') {
            throw new UnauthorizedException('This user is not authorized to update a book record.')
        }
        // validateAdminAccessOnly(auth.user)
        // update book
        book.merge(validatedData)
        await book.save()   // pass changes to db

        // fetch user that created the book
        await book.load('user')

        return book
    }

    public async destroy({ request, auth }: HttpContextContract) {
        console.log('deletebook')
        const book_id = request.input('book_id')
        const book = await Book.findOrFail(book_id)      // fetch thread to delete

        if (auth.user?.userType !== 'Admin' && request.all().access === 'no') {
            throw new UnauthorizedException('This user is not authorized to delete a book record.')
        }

        return book.delete()
    }
}
