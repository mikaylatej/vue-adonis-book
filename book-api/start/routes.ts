/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('auth/register', 'AuthController.register').as('auth.register')
  Route.post('auth/login', 'AuthController.login').as('auth.login')

  // CRUD books
  Route.post('books', 'BooksController.store').middleware(['auth', 'permissions']) // create book record
  Route.get('books/:id', 'BooksController.showBook')
  .middleware('auth')  // show book
  Route.get('books', 'BooksController.showAllBooks')
  .middleware(['auth', 'permissions']) // show all books
  Route.patch('books', 'BooksController.update').middleware(['auth', 'permissions'])  // update book record
  Route.delete('books', 'BooksController.destroy').middleware(['auth', 'permissions'])  // delete book record

  // order
  Route.post('books/:id/order', 'OrdersController.store').middleware('auth')  // create order
  Route.get('orders/:user_id', 'OrdersController.showUserOrders').middleware('auth')  // show user orders
  // show all orders
  Route.get('orders', 'OrdersController.showAllOrders').middleware('auth')  
    .as('show.orders')
  Route.patch('orders/:user_id/:order_id', 'OrdersController.update').middleware(['auth', 'permissions'])   // update order
  // views
  // Route.get('orders', 'OrdersController.ordersView').as('show.orders')

  // user account (settings)
  Route.patch('account/:id', 'UsersController.update').middleware('auth')  // update account details
  Route.delete('account/:id', 'UsersController.destroy').middleware('auth')  // delete account 

  // user permissions
  Route.post('permissions', 'UserPermissionsController.store').middleware(['auth', 'admin']) // create new record in user permissions
  Route.delete('permissions', 'UserPermissionsController.destroy').middleware(['auth', 'admin']) // create new record in user permissions

}).prefix('api')

// Route.get('/', async () => {
//   return { hello: 'world' }
// })
