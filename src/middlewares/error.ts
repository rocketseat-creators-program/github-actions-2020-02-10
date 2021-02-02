import { Context } from 'koa';

export async function middleware(ctx: Context, next: Function) {
	try {
		await next();
	} catch (err) {
		/**
		 * centralized error response
		 */
		/* istanbul ignore else */
		if (err.name === 'ApiError') {
			ctx.status = err.status /* istanbul ignore next */ || 500;
			ctx.body = {
				error: {
					status: ctx.status,
					code: err.code,
					message: err.messageObject,
					type: err.name
				},
				requestId: ctx.requestId
			};
			/* istanbul ignore next */
		} else if (err.name === 'ValidationError') {
			// joi
		} else {
			// non treated error
			ctx.status = 500;
			ctx.body = {
				error: {
					status: 500,
					code: 'INTERNAL_SERVER_ERROR',
					message: process.env.DEBUG ? err.message : 'Ocorreu um erro inesperado',
					type: process.env.DEBUG ? err.name : 'Error'
				},
				requestId: ctx.requestId
			};
			if (process.env.DEBUG) {
				ctx.body.error.stack = err.stack;
			}
		}

		//centralized error handling
		ctx.app.emit('error', err, ctx);
	}
}

export async function handler(err: Error, ctx: Context) {
	/**
	 * log error,
	 * write to file,
	 * request info from db,
	 * save to db,
	 * notify someone,
	 * etc...
	 */
	console.error('ERR: ', ctx.requestId, err.message, ctx);
	console.error('ERR: object ', err, err.stack);
}

export default { middleware, handler };
