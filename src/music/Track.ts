import ytdl from "ytdl-core";
import ytSearch from "yt-search";

export class Track {
	private title: string | undefined = undefined;
	private url: string | undefined = undefined;

	public async fromURL(typedUrl: string): Promise<Track> {
		const youtubeRegex = /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/;

		if (typedUrl.match(youtubeRegex)) {
			const trackInfo = await ytdl.getInfo(typedUrl);

			this.title = trackInfo.videoDetails.title;
			this.url = trackInfo.videoDetails.video_url;

			return this;
		}
		throw new Error(`Invalid or unsupported music URL: ${typedUrl}`);
	}

	public async fromKeywords(keywords: string[]): Promise<Track> {
		const args = keywords.join(" ");
		const result = await ytSearch(args);

		if (result.videos.length > 0) {
			this.title = result.videos[0].title;
			this.url = result.videos[0].url;
			return this;
		}

		throw new Error(`Could not find any video with the specified keywords: '${args}'`);
	}
}
