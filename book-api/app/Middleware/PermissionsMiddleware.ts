import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UserPermission from 'App/Models/UserPermission'

const permissionsObject = {
  'POST/api/books': 'ADD_PRODUCT',
  'DELETE/api/books': 'DELETE_PRODUCT',
  'PATCH/api/books': 'EDIT_PRODUCT',
  'PATCH/api/orders': 'EDIT_ORDER',
  'GET/api/books': 'GET_ALL_BOOKS'
}

const permissionValidator = async (user, action) => {
  const query = await UserPermission.query()
    .where('user_id', user.id)
    .andWhere('user_permission', action).clone()

  return query.length > 0
}

const getPathname = (urlString) => {
  const index = urlString.indexOf(':')
  if (index === -1) {
    return urlString
  } 
  const url = urlString.split(':')[0]
  const finalUrl = url.slice(0, url.length-1)
  console.log('GET PATHNAME: ' + finalUrl)
  return finalUrl
}

export default class PermissionsMiddleware {
  public async handle({ auth, response, request }: HttpContextContract, next: () => Promise<void>) {
    const user = auth.user?.toJSON()

    const pathName = getPathname(request.ctx?.route?.pattern) // remove params from pathname
    const permissionKey = request.method() + pathName
    const action = permissionsObject[permissionKey]
    const hasPermission = await permissionValidator(user, action)

    if (action === 'GET_ALL_BOOKS' && !hasPermission) {
      // response.unauthorized({ error: 'No access rights' })
      console.log('has no access to all books')
      request.all().access = 'no'
      // await next()
    } else if (!hasPermission && user?.userType !== 'Admin') {
      response.unauthorized({ error: 'No access rights' })
      console.log('has no access rights')
      // request.all().access = 'no'
      return
    }

    await next()
  }
}
