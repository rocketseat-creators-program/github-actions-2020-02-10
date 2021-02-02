import ApiError from '../helpers/ApiError';

export default async function(ctx: any, next: Function) {
	if (!ctx.request.header || !ctx.request.header.authorization)
		throw new ApiError(401, 'UNAUTHORIZED', 'Obrigatório header de autenticação');
	const parts = ctx.request.header.authorization.split(' ');
	if (parts.length === 2 && parts[0] === 'Bearer') {
		ctx.request.token = parts[1];
		if (ctx.request.token === process.env.AUTH_TOKEN) return next();
	}
	throw new ApiError(403, 'FORBIDDEN', 'Você não tem permissão para realizar esta ação');
}
