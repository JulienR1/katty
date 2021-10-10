import { AudioResource, createAudioResource, demuxProbe } from "@discordjs/voice";
import { raw } from "youtube-dl-exec";
import ytSearch from "yt-search";
import ytdl from "ytdl-core";
import { YoutubeTrackFactory } from "./Factories/YoutubeTrackFactory";
import { ITrack, ITrackData } from "./ITrack";

export class Track implements ITrack {
	// TODO: remove variables
	public title: string | undefined = undefined;
	public url: string | undefined = undefined;
	public thumbnailURL: string | undefined = undefined;

	constructor(private trackData: ITrackData) {}

	public getData(): ITrackData {
		return JSON.parse(JSON.stringify(this.trackData));
	}

	// TODO
	public getAudioResource(): Promise<AudioResource<Track>> {
		return undefined as any;
	}

	public getStream(): Promise<AudioResource<Track>> {
		if (!this.url) {
			throw new Error("Invalid track.");
		}

		const videoUrl = this.url;
		return new Promise((resolve, reject) => {
			const process = raw(
				videoUrl,
				{ o: "-", q: "", f: "bestaudio[ext=webm+acodec=opus+asr=48000]/bestaudio", r: "100K" },
				{ stdio: ["ignore", "pipe", "ignore"] }
			);

			if (!process.stdout) {
				return reject(new Error("No output stream"));
			}

			const stream = process.stdout;
			const onError = (err: Error) => {
				if (!process.killed) {
					process.kill();
				}
				stream.resume();
				reject(err);
			};

			process
				.once("spawn", async () => {
					try {
						const probe = await demuxProbe(stream);
						return resolve(createAudioResource(probe.stream, { metadata: this, inputType: probe.type }));
					} catch (err) {
						onError(err as Error);
					}
				})
				.catch(onError);
		});

		// return ytdl(this.url, { filter: "audioonly" });
	}

	public async fromURL(typedUrl: string): Promise<Track> {
		new YoutubeTrackFactory().from(typedUrl);
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
