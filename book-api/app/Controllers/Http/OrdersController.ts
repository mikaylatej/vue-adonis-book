import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UnauthorizedException from 'App/Exceptions/UnauthorizedException'
import Book from 'App/Models/Book'
import Order from 'App/Models/Order'
import OrderValidator from 'App/Validators/OrderValidator'
import UpdateOrderValidator from 'App/Validators/UpdateOrderValidator'

export default class OrdersController {

    // public ordersView ({ view }:HttpContextContract) {
    //     return view.render('orders')
    // }

    public async store({ request, params, auth }: HttpContextContract) {
        const { address, contact_number } = await request.validate(OrderValidator)

        const user = auth.user
        const book = await Book.findOrFail(params.id)

        const errorUserType =
            'Book cannot be ordered because of user type or location.' +
            '\nBook category: ' + book.accessType
        const errorUserLocation =
            'Book cannot be ordered because of user location.' +
            '\nBook location: ' + book.location

        if (user?.userType === 'Student' && (book.accessType !== 'Student' && book.accessType !=='All')) {
            throw new UnauthorizedException(errorUserType)
        } 
        if (user?.location !== book.location) {
            throw new UnauthorizedException(errorUserLocation)
        }
        // console.log('CAN ORDER')
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
    }

    public async showUserOrders({ params, auth }: HttpContextContract) {
        // only view logged in user's orders
        // console.log(auth.user?.id + ' = ' + params.user_id)
        if (auth.user?.id == params.user_id || auth.user?.userType === 'Admin') {
            const orders = await Order.query()
                .where('user_id', params.user_id)
                .preload('user')
                .preload('book')

            return orders
        } else {
            throw new UnauthorizedException('Cannot view other users\' orders.')
        }
    }

    public async showAllOrders({ auth, request }: HttpContextContract) {
        // only admin can view
        if (auth.user?.userType === 'Admin' || request.all().access !== 'no') {
            const orders = await Order.query()
                .preload('user')
                .preload('book')
            return orders
            // return view.render('orders', { orders })
        } else {
            throw new UnauthorizedException('Cannot view other users\' orders.')
        }
    }

    public async update({ request, params, auth }: HttpContextContract) {
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
