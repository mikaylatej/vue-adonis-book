import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UnauthorizedException from 'App/Exceptions/UnauthorizedException'
import User from 'App/Models/User'
import UpdateUserValidator from 'App/Validators/UpdateUserValidator'

export default class UsersController {

    public async update ({ request, params, auth }:HttpContextContract) {
        const user = await User.findOrFail(params.id)   // fetch user to update
        const validatedData = await request.validate(UpdateUserValidator)

        if (auth.user?.id !== user.id && auth.user?.userType !== 'Admin') {
            throw new UnauthorizedException('This user is not authorized to update other\'s account details.')
        } else {
            user.merge(validatedData)
            await user.save()
            return user
        }
    }

    public async destroy ({ params, auth }:HttpContextContract) {
        const user = await User.findOrFail(params.id)

        if (auth.user?.id !== user.id && auth.user?.userType !== 'Admin') {
            throw new UnauthorizedException('This user is not authorized to update other\'s account details.')
        } 
        return user.delete()
    }
}
