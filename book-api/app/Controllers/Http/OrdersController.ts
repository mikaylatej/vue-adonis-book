import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UnauthorizedException from 'App/Exceptions/UnauthorizedException'
import Book from 'App/Models/Book'
import Category from 'App/Models/Category'
import OrderValidator from 'App/Validators/OrderValidator'

export default class OrdersController {
    public async store ({ request, params, auth }:HttpContextContract) {
        const { address, contact_number } = await request.validate(OrderValidator)
    
        const book = await Book.findOrFail(params.id)
        const bookCategory = await Category.findOrFail(book.categoryId)
        // console.log('book category: ', bookCategory.name)
        // console.log('user type: ', auth.user?.userType)

        const errorAdmin = 'Kindly login using your personal account to purchase.'
        const errorUser = 
            'Book cannot be ordered because of user type or location.' +
            '\nBook category: ' + bookCategory.name + 
            '\nBook location: ' + book.location
        const userType = auth.user?.userType    // current user type
        const userLocation = auth.user?.location

        console.log('userLocation: ', userLocation)
        console.log('bookLocation: ', book.location)
        if (userType === 'Admin') {
            throw new UnauthorizedException(errorAdmin)
        } else if (
            (bookCategory.name === userType || bookCategory.name === 'All Readers') &&
            userLocation === book.location
        ) {
            console.log('CAN ORDER')
            const order = await book.related('orders').create({
                userId: auth.user?.id,
                bookId: book.id,
                address: address,
                contactNumber: contact_number
            })
            await order.load('user')
            await order.load('book')

            return order
        } else {
            throw new UnauthorizedException(errorUser)
        }
    }
}
