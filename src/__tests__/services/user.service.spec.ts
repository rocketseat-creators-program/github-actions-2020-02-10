process.env.JWT_SECRET = 'test';

import UserService from '../../services/user.service';
import AuthService from '../../services/auth.service';
import User from '../../models/user.model';

jest.mock('../../models/user.model');

describe('UserService', () => {

	describe('.createUser', () => {

		it('should throw error if email already exists', async () => {
			// @ts-ignore
			User.create = jest.fn(
				r =>
					new Promise((resolve, reject) =>
						reject({code: 11000})
					)
			);
			try {
				const newUser = await UserService.createUser({
					email: 'email@domain.com',
					fullName: 'Teste',
					password: '123456'
				});
				fail(); // should never get to this line
			} catch (err) {
				expect(err.code).toEqual('EMAIL_REGISTERED');
			}
		});

		it('should return new user and token if email does not exists', async () => {
			// @ts-ignore
			User.create = jest.fn(object => new Promise(resolve => resolve({ _id: 'testeid', ...object })));
			// @ts-ignore
			AuthService.login = jest.fn(() => new Promise(resolve => resolve('token_valido')));
			const newUser: any = await UserService.createUser({
				email: 'email@domain.com',
				fullName: 'Teste',
				password: '123456'
			});
			expect(User.create).toHaveBeenCalledWith({
				email: 'email@domain.com',
				fullName: 'Teste',
				password: '123456'
			});
			expect(AuthService.login).toHaveBeenCalledWith('email@domain.com', '123456');
			expect(newUser.user.email).toEqual('email@domain.com');
			expect(newUser.token).toEqual('token_valido');
		});

	})

	describe('.getUser', () => {

		it('should search user by ID', async () => {
			//@ts-ignore
			User.findOne = jest
				.fn(r => new Promise(resolve => resolve({ _id: r._id })))
				//@ts-ignore
				.mockImplementationOnce(r => ({ select: jest.fn().mockResolvedValueOnce(r) }));
			const user = await UserService.getUser('id1');
			expect(User.findOne).toHaveBeenCalledWith({ _id: 'id1' });
			expect(user._id).toEqual('id1');
		});

	})
});
