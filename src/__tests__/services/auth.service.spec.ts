
process.env.JWT_SECRET = 'teste';
process.env.JWT_SECRET_ADMIN = 'teste-admin';

import AuthService from '../../services/auth.service';
import User from '../../models/user.model';
import * as bcrypt from 'bcrypt-nodejs';
import * as jwt from 'jsonwebtoken';
const atob = require('atob');
const btoa = require('btoa');

jest.mock('../../models/user.model');

describe('AuthService', () => {
	
	describe('.login', () => {

		it('should check if account exists and password matches', async () => {
			const hashedPassword = bcrypt.hashSync('123456', bcrypt.genSaltSync(8));
			// @ts-ignore
			User.find = jest.fn(
				object =>
					new Promise(resolve =>
						resolve([
							{
								_id: 'testeid',
								password: hashedPassword,
								...object,
								comparePassword: function(password: string) {
									return bcrypt.compareSync(password, this.password);
								}
							}
						])
					)
			);
			// @ts-ignore
			User.findOneAndUpdate = jest
				.fn((x, y, z) => new Promise(resolve => resolve({ ...x, ...y.$set })))
				//@ts-ignore
				.mockImplementationOnce((x, y, z) => ({
					setOptions: jest.fn().mockResolvedValueOnce({ ...x, ...y.$set })
				}));
			try {
				const token = await AuthService.login('email@domain.com', '123456');
				expect(User.find).toHaveBeenCalledWith({
					email: 'email@domain.com',
					deleted: { $ne: true }
				});
				expect(User.findOneAndUpdate).toHaveBeenCalledWith(
					{ _id: 'testeid' },
					{ $set: { lastSeen: expect.any(Date) } },
					{ new: true }
				);
			} catch (err) {
				fail(); // should never get to this line, so we fail it
			}
		});

		it('should throw error if email inst registered', async () => {
			// @ts-ignore
			User.find = jest.fn(object => new Promise(resolve => resolve([])));
			// @ts-ignore
			User.findOneAndUpdate = jest.fn((x, y, z) => new Promise(resolve => resolve(null)));
			try {
				await AuthService.login('email@domain.com', '12345678');
				fail(); //should never get to this line
			} catch (err) {
				expect(User.find).toHaveBeenCalledWith({
					email: 'email@domain.com',
					deleted: { $ne: true }
				});
				expect(User.findOneAndUpdate).not.toHaveBeenCalled();
				expect(err.code).toEqual('EMAIL_NOT_REGISTERED');
			}
		});
	
		it('should throw error if password doesnt match', async () => {
			const userHashedPassword = bcrypt.hashSync('12345678', bcrypt.genSaltSync(8));
			const loginPassword = bcrypt.hashSync('87654321', bcrypt.genSaltSync(8));
			// @ts-ignore
			User.find = jest.fn(
				object =>
					new Promise(resolve =>
						resolve([
							{
								_id: 'testeid',
								password: userHashedPassword,
								loginType: ['email'],
								...object,
								comparePassword: function(password: string) {
									return bcrypt.compareSync(password, loginPassword);
								}
							}
						])
					)
			);
			// @ts-ignore
			User.findOneAndUpdate = jest.fn((x, y, z) => new Promise(resolve => resolve(null)));
			try {
				await AuthService.login('email@domain.com', '12345678');
				fail(); //should never get to this line
			} catch (err) {
				expect(User.find).toHaveBeenCalledWith({
					email: 'email@domain.com',
					deleted: { $ne: true }
				});
				expect(User.findOneAndUpdate).not.toHaveBeenCalled();
				expect(err.code).toEqual('WRONG_PASSWORD');
			}
		});
	})
	describe('.validate', () => {

		it('should check if token is valid, and return decrypted token', () => {
			const payload = { id: 'userId', fullName: 'Eduardo Koller', email: 'email@domain.com' };
			const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
			const decryptedToken: any = AuthService.validate(token);
			expect(decryptedToken.id).toEqual(payload.id);
			expect(decryptedToken.fullName).toEqual(payload.fullName);
			expect(decryptedToken.email).toEqual(payload.email);
		});

		it('should throw error if token is not valid', () => {
			const payload = { id: 'userId', fullName: 'Eduardo Koller', email: 'email@domain.com' };
			const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }).split('.');
			const modifiedPayload = JSON.parse(atob(token[1]));
			modifiedPayload.id = 'modifiedUserId';
			token[1] = btoa(JSON.stringify(modifiedPayload));
			const newToken = token.join('.');
			expect(() => AuthService.validate(newToken)).toThrow();
		});
	})

	
});
