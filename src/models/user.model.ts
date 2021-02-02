import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt-nodejs';
import * as validator from 'validator';

interface IUserModel extends mongoose.Document {
	id: mongoose.Types.ObjectId;
	email: string;
	fullName: string;
	password?: string;
	lastSeen?: Date;
	createdAt?: Date;
	updatedAt?: Date;
	comparePassword: Function;
}

const UserSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			validate: function(value: string) {
				return validator.isEmail(value);
			}
		},
		fullName: {
			type: String,
			required: true,
			trim: true
		},
		password: {
			type: String
		},
		lastSeen: {
			type: Date
		}
	},
	{ timestamps: true }
);

UserSchema.pre('save', function(next: Function) {
	const user = <IUserModel>this;
	if (!user.isModified('password') || !user.password) return next();
	try {
		user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(8));
		return next();
	} catch (err) {
		return next(err);
	}
});

UserSchema.methods.comparePassword = function(password: string) {
	const user = <IUserModel>this;
	return bcrypt.compareSync(password, user.password);
};

export default mongoose.model<IUserModel>('User', UserSchema);
