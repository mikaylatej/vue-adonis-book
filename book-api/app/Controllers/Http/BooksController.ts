import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CreateBookValidator from 'App/Validators/CreateBookValidator'
import Book from 'App/Models/Book'
import UpdateBookValidator from 'App/Validators/UpdateBookValidator'
import UnauthorizedException from 'App/Exceptions/UnauthorizedException'
import Category from 'App/Models/Category'

export default class BooksController {
    
    public async showAllBooks ({ auth, request }:HttpContextContract) {
        const userType = request.input('user_type')
        const location = request.input('location')
        console.log('user type: ', userType)
        console.log('location: ', location)

        console.log('---------')
        console.log('login user: ', auth.user?.userType)
        console.log('user loc: ', auth.user?.location)

        if (auth.user?.userType === 'Admin') {
            try{
                const userBookCategory = await Category.findBy('name', userType)
                const allBooksCategory = await Category.findBy('name', 'All Readers')

                // console.log('userBookCategory ID: ', userBookCategory.id)
                const books = await Book.query()
                .if (userType, (query) => {
                    query
                        .where('category_id', allBooksCategory.id)
                        .orWhere('category_id', userBookCategory.id)
                })
                // .if (location, (query) => {
                //     query.where('location', location)
                // })
                .preload('category')
                return books
            } catch (error) {
                const book = await Book.query()
                    .preload('user')
                    .preload('category')
                
                return book
            }
        }
        else if (
            auth.user?.userType !== 'Admin' 
            && userType === auth.user?.userType 
            // && location === auth.user?.location
        ) {
            //get category record based on login user type
            const userBookCategory = await Category.findBy('name', userType)
            const allBooksCategory = await Category.findBy('name', 'All Readers')

            const books = await Book.query()
            .if (userType, (query) => {
                query
                    .where('category_id', allBooksCategory.id)
                    .orWhere('category_id', userBookCategory.id)
            })
            .preload('category')

            return books
        } else {
            throw new UnauthorizedException('You can only view books for ' + auth.user?.userType + 's.')
            // redirect to filtered page
        }
    }

    public async store ({ request, auth }:HttpContextContract) {
        const validatedData = await request.validate(CreateBookValidator)

        // user type must be Admin to create book
        if (auth.user?.userType !== 'Admin') {
            throw new UnauthorizedException('This user is not authorized to create a book record.')
        } else {
            const book = await auth.user?.related('books').create(validatedData)
            console.log(auth.user?.toJSON())    // to extract user info
            // fetch user that created the book and category it belongs to
            await book?.load('user')
            await book?.load('category')
            return book
        } 
    }

    public async showBook ({ params }:HttpContextContract) {
        const book = await Book.query()
            .where('id', params.id)
            .preload('user')
            .preload('category')
            .firstOrFail()
        
        return book
    }

    public async update ({ request, params, auth }:HttpContextContract) {
        const book = await Book.findOrFail(params.id)   // fetch book to update
        const validatedData = await request.validate(UpdateBookValidator)

        if (auth.user?.userType !== 'Admin') {
            throw new UnauthorizedException('This user is not authorized to update a book record.')
        }
        // update book
        book.merge(validatedData)
        await book.save()   // pass changes to db

        // fetch user that created the book and category it belongs to
        await book.load('user')
        await book.load('category')

        return book
    }

    public async destroy ({ params, auth }:HttpContextContract) {
        const book = await Book.findOrFail(params.id)      // fetch thread to delete

        if (auth.user?.userType !== 'Admin') {
            throw new UnauthorizedException('This user is not authorized to delete a book record.')
        }

        return book.delete()
    }
}
