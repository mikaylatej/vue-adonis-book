import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UnauthorizedException from 'App/Exceptions/UnauthorizedException'
import Book from 'App/Models/Book'
import Category from 'App/Models/Category'
import Order from 'App/Models/Order'
import OrderValidator from 'App/Validators/OrderValidator'
import UpdateOrderValidator from 'App/Validators/UpdateOrderValidator'

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
                contactNumber: contact_number,
                status: 'Processing'
            })
            await order.load('user')
            await order.load('book')

            return order
        } else {
            throw new UnauthorizedException(errorUser)
        }
    }

    public async showUserOrders ({ params, auth }:HttpContextContract) {
        // only view logged in user's orders
        // console.log(auth.user?.id + ' = ' + params.id)
        if (auth.user?.id == params.id || auth.user?.userType === 'Admin') {
            const orders = await Order.query()
            .where('user_id', params.user_id)
            .preload('user')
            .preload('book')

            return orders
        } else {
            throw new UnauthorizedException('Cannot view other users\' orders.')
        }
    }

    public async showAllOrders ({ auth }:HttpContextContract) {
        // only admin can view
        if (auth.user?.userType === 'Admin') {
            const orders = await Order.query()
            .preload('user')
            .preload('book')

            return orders
        } else {
            throw new UnauthorizedException('Cannot view other users\' orders.')
        }
    }

    public async update ({ request, params, auth }:HttpContextContract) {
        // can only update status of order
        const order = await Order.findOrFail(params.order_id)
        const validatedData = await request.validate(UpdateOrderValidator)

        if (auth.user?.userType !== 'Admin') {
            throw new UnauthorizedException('This user is not authorized to update a book record.')
        }
        order.merge(validatedData)
        await order.save()

        await order.load('user')
        await order.load('book')

        return order
    }
}
