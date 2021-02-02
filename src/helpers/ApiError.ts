export default class ApiError extends Error {
	code: string;
	status: number;
	messageObject: string | Record<string, any>;
	constructor(status: number, code: string, message: string | Record<string, any> | Array<string>) {
		/* istanbul ignore next */
		if (typeof message === 'object') super(JSON.stringify(message));
		else super(message.toString());
		this.code = code;
		this.status = status;
		this.name = 'ApiError';
		this.messageObject = message;
	}
}
