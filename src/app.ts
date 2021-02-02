import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as cors from '@koa/cors';
import * as mongoose from 'mongoose';
import * as bodyParser from 'koa-bodyparser';

require('dotenv').config();

const mongodbConnString = process.env.MONGODB_CONN_STRING || 'mongodb://localhost';

function createConnection() {
	mongoose
		.connect(mongodbConnString, {
			useNewUrlParser: true,
			useCreateIndex: true,
			useFindAndModify: false,
			useUnifiedTopology: true,
			dbName: `auth_${process.env.NODE_ENV}`
		})
		.then(
			() => console.log('Successfully connected to MongoDB'),
			error => {
				console.error('Error connecting to mongoDB:', error);
				console.error('Retrying...');
				createConnection();
			}
		);
}

createConnection();

import ErrorHandler from './middlewares/error';
import userRoutes from './routes/user.routes';
import authRoutes from './routes/auth.routes';

const app = new Koa();
app.use(cors());
app.use(bodyParser());
app.use(ErrorHandler.middleware);
app.on('error', ErrorHandler.handler);

const apiv1 = new Router({ prefix: '/v1' });

apiv1.use(userRoutes.routes());
apiv1.use(authRoutes.routes());

apiv1.get('/health', async (ctx: Koa.Context) => {
	ctx.body = {status: 'ok'}
});

app.use(apiv1.routes());

export default app;
