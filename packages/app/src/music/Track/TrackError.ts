class TrackError extends Error {
	constructor(msg: string) {
		super(msg);

		Object.setPrototypeOf(this, TrackError.prototype);
	}
}

export { TrackError };
