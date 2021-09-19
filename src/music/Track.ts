import ytdl from "ytdl-core";
import ytSearch from "yt-search";
import { Readable } from "stream";

export class Track {
	public title: string | undefined = undefined;
	public url: string | undefined = undefined;
	public thumbnailURL: string | undefined = undefined;

	public getStream(): Readable {
		if (!this.url) {
			throw new Error("Invalid track.");
		}
		return ytdl(this.url, { filter: "audioonly" });
	}

	public async fromURL(typedUrl: string): Promise<Track> {
		const youtubeRegex = /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/;

		if (typedUrl.match(youtubeRegex)) {
			const trackInfo = await ytdl.getInfo(typedUrl);

			this.title = trackInfo.videoDetails.title;
			this.url = trackInfo.videoDetails.video_url;
			this.thumbnailURL = trackInfo.videoDetails.thumbnails[1].url;

			return this;
		}
		throw new Error(`Invalid or unsupported music URL: ${typedUrl}`);
	}

	public async fromKeywords(keywords: string[]): Promise<Track> {
		const args = keywords.join(" ");
		const result = await ytSearch(args);

		if (result.videos.length > 0) {
			const videoData = result.videos[0];
			this.title = videoData.title;
			this.url = videoData.url;
			this.thumbnailURL = videoData.thumbnail;
			return this;
		}

		throw new Error(`Could not find any video with the specified keywords: '${args}'`);
	}
}
