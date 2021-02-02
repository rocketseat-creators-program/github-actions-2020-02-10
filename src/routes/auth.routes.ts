import * as Router from 'koa-router';
import AuthController from '../controllers/auth.controller';
import AuthMiddleware from '../middlewares/auth';

const router = new Router();

router.post('/auth/login', AuthController.login);
router.post('/auth/validate', AuthController.validate);

export default router;
