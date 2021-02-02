import * as Router from 'koa-router';
import UserController from '../controllers/user.controller';
import AuthMiddleware from '../middlewares/auth';

//initialize router object
const router = new Router();

//configure routes
router.post('/users', AuthMiddleware, UserController.create);
router.get('/users/:id', AuthMiddleware, UserController.getUser);

export default router;
