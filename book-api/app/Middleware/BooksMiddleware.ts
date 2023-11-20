import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UserPermission from 'App/Models/UserPermission'

const permissionsObject = {
  'POST/api/books': 'ADD_PRODUCT',
  'DELETE/api/books': 'DELETE_PRODUCT',
  'PATCH/api/books': 'EDIT_PRODUCT'
}

const permissionValidator = async (user, action) => {
  const query = await UserPermission.query()
    .where('user_id', user.id)
    .andWhere('user_permission', action).clone()

  return query.length > 0
}

export default class BooksMiddleware {
  public async handle({ auth, response, request }: HttpContextContract, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    const user = auth.user?.toJSON()
    console.log('user id: ' + user?.id)
    const permissionKey = request.method() + request.parsedUrl.pathname
    const action = permissionsObject[permissionKey]
    console.log('action: ' + action)
    const hasPermission = await permissionValidator(user, action)

    
    console.log(hasPermission)
    if (!hasPermission) {
      response.unauthorized({ error: 'No access rights' })
      return
    }

    await next()
  }
}
