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

  Route.post('books', 'BooksController.store').middleware('auth') // create book record
  Route.get('books/:id', 'BooksController.show')  // show book
  Route.get('books', 'BooksController.index')     // show all books
  Route.patch('books/:id', 'BooksController.update')  // update book record
  Route.delete('books/:id', 'BooksController.destroy')  // delete book record
}).prefix('api')

// Route.get('/', async () => {
//   return { hello: 'world' }
// })
