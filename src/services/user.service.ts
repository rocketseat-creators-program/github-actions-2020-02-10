import User from '../models/user.model';
import AuthService from './auth.service';
import ApiError from '../helpers/ApiError';

interface IUser {
	email: string;
	password: string;
	fullName: string;
}

export default class UserService {
	static async createUser(userObject: IUser) {
		try { 
			const user = await User.create(userObject);
			let token = await AuthService.login(userObject.email, userObject.password);
			return { user, token };
		} catch(err) {
			if(err.code && err.code === 11000)
				throw new ApiError(400, 'EMAIL_REGISTERED', 'E-mail já cadastrado')
			throw err;
		}
	}

	static async getUser(userId: string) {
		const user = await User.findOne({ _id: userId }).select([
			'-password',
			'-createdAt',
			'-updatedAt',
			'-__v'
		]);
		return user;
	}

}
