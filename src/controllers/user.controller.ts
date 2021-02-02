import UserService from '../services/user.service';
import ApiError from '../helpers/ApiError';
import { Context } from 'koa';

export default class UserController {
	static async create(ctx: Context) {
		if (!ctx.request.body.email)
			throw new ApiError(400, 'EMAIL_REQUIRED', '"email" é obrigatório');
		if (!ctx.request.body.fullName)
			throw new ApiError(400, 'FULLNAME_REQUIRED', '"fullName" é obrigatório');
		if (!ctx.request.body.password)
			throw new ApiError(400, 'PASSWORD_REQUIRED', '"password" é obrigatório');
		if (ctx.request.body._id) delete ctx.request.body._id;
		const newUser = await UserService.createUser(ctx.request.body);
		ctx.body = newUser;
	}

	static async getUser(ctx: Context) {
		const user = await UserService.getUser(ctx.params.id);
		ctx.body = user;
	}
}
