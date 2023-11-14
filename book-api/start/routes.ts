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
  Route.post('auth/register', 'AuthController.register')
  Route.post('auth/login', 'AuthController.login')

  // CRUD
  Route.post('books', 'BooksController.store').middleware('auth') // create book record
  Route.get('books/:id', 'BooksController.showBook').middleware('auth')  // show book
  Route.get('books', 'BooksController.showAllBooks').middleware('auth')    // show all books
  Route.patch('books/:id', 'BooksController.update').middleware('auth')  // update book record
  Route.delete('books/:id', 'BooksController.destroy').middleware('auth')  // delete book record

  // order
  Route.post('books/:id/order', 'OrdersController.store').middleware('auth')
  Route.get('orders/:id', 'OrdersController.showUserOrders').middleware('auth')  // show user orders
  Route.get('orders', 'OrdersController.showAllOrders').middleware('auth')  // show all orders
}).prefix('api')

// Route.get('/', async () => {
//   return { hello: 'world' }
// })
