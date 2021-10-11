export class InvalidPrefixError extends Error {
	constructor(msg: string) {
		super("Invalid prefix: " + msg);
		Object.setPrototypeOf(this, InvalidPrefixError.prototype);
	}
}
