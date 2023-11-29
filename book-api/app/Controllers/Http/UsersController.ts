import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UnauthorizedException from 'App/Exceptions/UnauthorizedException'
import User from 'App/Models/User'
import UpdateUserByAdminValidator from 'App/Validators/UpdateUserByAdminValidator'
import UpdateUserValidator from 'App/Validators/UpdateUserValidator'

export default class UsersController {

    public async showOwn({ auth }:HttpContextContract) {
        const loginUser = auth.user?.toJSON()
        const user = await User.findOrFail(loginUser?.id)
        // if (auth.user?.id !== user.id && auth.user?.userType !== 'Admin') {
        //     throw new UnauthorizedException('This user is not authorized to view other\'s account details.')
        // }

        return user
    }
    public async showUser({ params, auth }:HttpContextContract) {
        const user = await User.findOrFail(params.id)
        if (auth.user?.id !== user.id && auth.user?.userType !== 'Admin') {
            throw new UnauthorizedException('This user is not authorized to view other\'s account details.')
        }
        return user
    }

    public async update({ request, params, auth }: HttpContextContract) {
        console.log('update user be')
        const user = await User.findOrFail(params.id)   // fetch user to update
        if (auth.user?.userType === 'Admin') {
            console.log('admin upd')
            const validatedData = await request.validate(UpdateUserByAdminValidator)
            user.merge(validatedData)
            await user.save()
            return user
        } else if (auth.user?.id !== user.id && auth.user?.userType !== 'Admin') {
            throw new UnauthorizedException('This user is not authorized to update other\'s account details.')
        } else {
            const validatedData = await request.validate(UpdateUserValidator)
            user.merge(validatedData)
            await user.save()
            return user
        }
    }

    public async destroy({ params, auth }: HttpContextContract) {
        const user = await User.findOrFail(params.id)

        if (auth.user?.id !== user.id && auth.user?.userType !== 'Admin') {
            throw new UnauthorizedException('This user is not authorized to update other\'s account details.')
        }
        return user.delete()
    }
}
