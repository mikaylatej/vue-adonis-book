import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AdminMiddleware {
  public async handle({ auth, response, request }: HttpContextContract, next: () => Promise<void>) {
    // check if login user is Admin
    const user = auth.user?.toJSON()
    console.log(user?.user_type)

    if (user?.user_type !== 'Admin') {
      response.unauthorized({ error: 'No access rights' })
      // request.all().access = 'none'
      return
    }

    await next()
  }
}
