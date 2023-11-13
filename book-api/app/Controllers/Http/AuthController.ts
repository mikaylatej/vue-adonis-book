import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import RegisterValidator from 'App/Validators/RegisterValidator'

export default class AuthController {
    public async register({ request, auth, response }: HttpContextContract) {
        const validatedData = await request.validate(RegisterValidator)
        // once validated, persist validated data to db
        const user = await User.create(validatedData)
        // log in user instead of having them login manually
        // get api token
        const token = await auth.login(user)
        return token
    }

    public async login({ request, auth }: HttpContextContract) {
        // get user request, extract email and password only
        const { email, password } = request.all()

        try {
            // try login the user
            // if matches, user will be logged in and token will be generated
            const token = await auth.attempt(email, password)
            return token
        } catch (error) {
            // if record does not match in db
            return "We couldn't verify your credentials."
        }
    }
}
