export class Helpers {
	public static isYoutube(url: string) {
		const youtubeRegex = /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/;
		return url.match(youtubeRegex);
	}

	public static isYoutubePlaylist(url: string) {
		const playlistRegex = /^.*(\/playlist\?list=).*$/;
		return this.isYoutube(url) && url.match(playlistRegex);
	}

	public static isKeywords(keywords: string) {
		const isSomethingElse = this.isYoutube(keywords) || this.isYoutubePlaylist(keywords);
		return !isSomethingElse;
	}
}
