import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CreateBookValidator from 'App/Validators/CreateBookValidator'
import Book from 'App/Models/Book'
import UpdateBookValidator from 'App/Validators/UpdateBookValidator'
import UnauthorizedException from 'App/Exceptions/UnauthorizedException'
import Order from 'App/Models/Order'
// import { getUserType } from 'App/lib/Util.js'

export default class BooksController {

    public async showAllBooks({ auth, request }: HttpContextContract) {
        const user = auth.user?.toJSON()
        const location = request.input('location')
        const access_type = request.input('access_type')
        console.log('location: ' + location)
        // console.log('imported user type: ' + getUserType(user))
        let query = Book.query().clone()

        if (user?.user_type === 'Student') {
            query = query.where('access_type', 'Student')
                .orWhere('access_type', 'All')
                .andWhere('location', user?.location)
                .clone()
            return query
        }
        // return generateFilterQuery(query, location, access_type)
        if (location != null && access_type != null) {
            // if there is location in param, filter by loc
            // else return all books (from all locs)
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
        const validatedData = await request.validate(CreateBookValidator)
        // user type must be Admin to create book
        if (auth.user?.userType !== 'Admin') {
            throw new UnauthorizedException('This user is not authorized to create a book record.')
        } else {
            const book = await auth.user?.related('books').create(validatedData)
            console.log(auth.user?.toJSON())    // to extract user info
            // fetch user that created the book and category it belongs to
            await book?.load('user')
            return book
        }
    }

    public async showBook({ params, auth }: HttpContextContract) {
        const user = auth.user?.toJSON()
        const book = await Book.findOrFail(params.id)
        const order = await Order.findBy('book_id', params.id)

        console.log(order == null)
        if (user?.user_type === 'Student' 
            && (book.accessType === 'Teacher' || user?.location !== book.location)
            && order == null
        ) {
            throw new UnauthorizedException('This user is not authorized to view this book record.')
        }
        const bookList = await Book.query()
            .where('id', params.id)
            .preload('user')
            .firstOrFail()

        return bookList
    }

    public async update({ request, params, auth }: HttpContextContract) {
          // fetch book to update
        const validatedData = await request.validate(UpdateBookValidator)
        const book_id = request.input('book_id')
        const book = await Book.findOrFail(book_id) 

        if (auth.user?.userType !== 'Admin') {
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

    public async destroy({  auth, request }: HttpContextContract) {
        const book_id = request.input('book_id')
        const book = await Book.findOrFail(book_id)      // fetch thread to delete

        if (auth.user?.userType !== 'Admin') {
            throw new UnauthorizedException('This user is not authorized to delete a book record.')
        }

        return book.delete()
    }
}
