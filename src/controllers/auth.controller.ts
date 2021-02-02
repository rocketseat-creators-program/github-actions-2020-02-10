import AuthService from '../services/auth.service';
import ApiError from '../helpers/ApiError';
import { Context } from 'koa';

export default class AuthController {
	static async login(ctx: Context) {
		if (!ctx.request.body.email) throw new ApiError(400, 'EMAIL_REQUIRED', '"email" é obrigatório');
		if (!ctx.request.body.password)
			throw new ApiError(400, 'PASSWORD_REQUIRED', '"password" é obrigatório');
		try {
			const token = await AuthService.login(ctx.request.body.email, ctx.request.body.password);
			ctx.body = { token };
		} catch (err) {
			console.error('ERR', err);
			/* istanbul ignore else */
			if (err.code === 'NOT_EMAIL_USER') {
				throw new ApiError(
					400,
					'NOT_EMAIL_USER',
					'Login por e-mail não encontrado, tente pelo Google'
				);
			} else if (err.code === 'WRONG_PASSWORD' || err.code === 'EMAIL_NOT_REGISTERED') {
				throw new ApiError(400, 'WRONG_CREDENTIALS', 'Usuário/senha incorreto');
			} else {
				throw new ApiError(500, 'UNEXPECTED_ERROR', 'Ocorreu um erro inesperado');
			}
		}
	}

	static validate(ctx: Context) {
		if (!ctx.request.body.token) throw new ApiError(400, 'TOKEN_REQUIRED', '"token" é obrigatório');
		try {
			const payload = AuthService.validate(ctx.request.body.token);
			ctx.body = payload;
		} catch (err) {
			console.error('ERR', err);
			throw new ApiError(400, 'INVALID_TOKEN', 'Token inválido');
		}
	}
}
