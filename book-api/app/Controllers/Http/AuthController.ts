import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UnauthorizedException from 'App/Exceptions/UnauthorizedException'
import User from 'App/Models/User'
import RegisterValidator from 'App/Validators/RegisterValidator'

export default class AuthController {

    public showRegister ({ view }:HttpContextContract) {
        return view.render('auth/register')
    }
    public async register({ response, request, auth }: HttpContextContract) {
        const validatedData = await request.validate(RegisterValidator)
        
        // check if there is already an admin user
        let adminUser = await User.findBy('user_type', 'Admin')
        console.log('no admin: ', (adminUser == null))

        if (adminUser != null && validatedData.userType === 'Admin') {
            throw new UnauthorizedException('Cannot register as admin. Current admins have to set your user type as Admin.')
        }
        
        // once validated, persist validated data to db
        const user = await User.create(validatedData)
        const token = await auth.login(user)
        return token
        // return response.redirect('/api/books')
    }

    public showLogin ({ view }:HttpContextContract) {
        return view.render('auth/login')
    }
    public async login({ request, auth, response, view }: HttpContextContract) {
        console.log('login backend')
        // get user request, extract email and password only
        const { email, password } = request.all()

        try {
            // try login the user
            // if matches, user will be logged in and token will be generated
            const token = await auth.attempt(email, password)
            console.log(token)
            return token
            // response.send({ token })

            // return response.redirect().toPath('/api/books')
            // return response.redirect().toRoute('BooksController.showAllBooks', { token })

            // return view.render('books', { email, token })
        } catch (error) {
            // if record does not match in db
            throw new UnauthorizedException('We couldn\'t verify your credentials.')
            // return "We couldn't verify your credentials."
        }
    }

    public async logout({ response, auth }:HttpContextContract) {
        await auth.logout()
        return
        // return response.redirect().toPath('/auth/login')
    }
}
