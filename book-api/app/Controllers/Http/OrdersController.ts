import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
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
        const errorUser = 'Book cannot be ordered because of user type. Book category: ' + bookCategory.name + '.'
        const userType = auth.user?.userType    // current user type
        
        if (userType === 'Admin') {
            // console.log('Kindly login using your personal account to purchase.')
            return errorAdmin
        } else if (bookCategory.name === userType || bookCategory.name === 'All Readers') {
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
            // console.log('CANNOT ORDER')
            return errorUser
        }
    }
}
