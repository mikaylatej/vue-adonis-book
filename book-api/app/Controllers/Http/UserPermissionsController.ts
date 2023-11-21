import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UserPermission from 'App/Models/UserPermission'
import UserPermissionValidator from 'App/Validators/UserPermissionValidator'

export default class UserPermissionsController {
    public async store({ request }:HttpContextContract) {
        const validatedData = await request.validate(UserPermissionValidator)

        const userPermission = await UserPermission.create(validatedData)
        return userPermission
    }
}
