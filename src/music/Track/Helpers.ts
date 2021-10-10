export class Helpers {
	public static isYoutube(url: string) {
		const youtubeRegex = /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/;
		return url.match(youtubeRegex);
	}

	// TODO
	public static isYoutubePlaylist(url: string) {
		return false;
	}

	public static isKeywords(keywords: string) {
		const isSomethingElse = this.isYoutube(keywords) || this.isYoutubePlaylist(keywords);
		return !isSomethingElse;
	}
}
