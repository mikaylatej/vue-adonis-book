import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import UserPermission from 'App/Models/UserPermission'
import UserPermissionValidator from 'App/Validators/UserPermissionValidator'

export default class UserPermissionsController {

    public async getUsers() {
        const users = await User.query().clone()
        return users
    }

    public async getUserPermissions({ params }: HttpContextContract) {
        const userPer = await UserPermission.query()
            .where('user_id', params.id)
            .preload('user')
            
        // const permissions = await UserPermission.query().clone()
        return userPer
    }

    public async getPermissions() {
        const permissions = await UserPermission.query().clone()
        return permissions
    }

    public async store({ request }: HttpContextContract) {
        const validatedData = await request.validate(UserPermissionValidator)

        const userPermission = await UserPermission.create(validatedData)
        return userPermission
    }

    public async destroy({ request }: HttpContextContract) {
        const permission_id = request.input('id')
        // console.log('in destroy: ' + request.all().access)
        const userPermission = await UserPermission.findOrFail(permission_id)
        return userPermission.delete()
    }
}
