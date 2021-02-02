import * as jwt from 'jsonwebtoken';
import User from '../models/user.model';
import ApiError from '../helpers/ApiError';

export default class AuthService {
	static async login(userEmail: string, password: string) {
		const [user] = await User.find({ email: userEmail, deleted: { $ne: true } });
		if (!user) {
			throw new ApiError(401, 'EMAIL_NOT_REGISTERED', 'E-mail não registrado');
		}
		// @ts-ignore
		if (!user.comparePassword(password)) {
			throw new ApiError(400, 'WRONG_PASSWORD', 'Senha incorreta');
		}

		await User.findOneAndUpdate(
			{ _id: user._id },
			{ $set: { lastSeen: new Date() } },
			{ new: true }
		).setOptions({
			timestamps: false
		});

		const { _id, fullName, email } = user;
		return jwt.sign({ _id, fullName, email }, process.env.JWT_SECRET, { expiresIn: '2w' });
	}

	static validate(token: string) {
		return jwt.verify(token, process.env.JWT_SECRET);
	}
}
