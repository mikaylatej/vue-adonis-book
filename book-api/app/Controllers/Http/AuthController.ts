import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UnauthorizedException from 'App/Exceptions/UnauthorizedException'
import User from 'App/Models/User'
import RegisterValidator from 'App/Validators/RegisterValidator'

export default class AuthController {
    public async register({ request, auth }: HttpContextContract) {
        const validatedData = await request.validate(RegisterValidator)
        
        // check if there is already an admin user
        let adminUser = await User.findBy('user_type', 'Admin')
        console.log('has admin: ', (adminUser == null))

        if (adminUser != null && validatedData.userType === 'Admin') {
            throw new UnauthorizedException('Cannot register as admin. Current admins have to set your user type as Admin.')
        }
        
        // once validated, persist validated data to db
        const user = await User.create(validatedData)
        console.log(validatedData)
        // log in user instead of having them login manually
        // get api token
        const token = await auth.login(user)
        return token
        
    }

    public async login({ request, auth, response, view }: HttpContextContract) {
        // get user request, extract email and password only
        const { email, password } = request.all()

        try {
            // try login the user
            // if matches, user will be logged in and token will be generated
            const token = await auth.attempt(email, password)
            return token
            // response.send({ token })
            // return response.redirect().toPath('../books')
            // return view.render('success', { email })
        } catch (error) {
            // if record does not match in db
            return "We couldn't verify your credentials."
        }
    }
}
