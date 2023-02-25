import { AudioResource, createAudioResource, demuxProbe } from "@discordjs/voice";
import { Options, ExecaChildProcess } from "execa";
import { ITrack, ITrackData } from "./ITrack";
import { TrackError } from "./TrackError";
import { raw } from "youtube-dl-exec";
import { Readable } from "stream";
import * as config from "./../../config.json";

export class Track implements ITrack {
	private downloadFlags = { o: "-", q: "", f: "bestaudio[ext=webm+acodec=opus+asr=48000]/bestaudio", r: "100K" };
	private downloadOptions: Options<string> = { stdio: ["ignore", "pipe", "ignore"] };

	constructor(private trackData: ITrackData) {
		if (parseInt(this.trackData.lengthSeconds) >= config.songMaxLengthInMinutes * 60) {
			throw new TrackError(`Cannot play a song longer than ${config.songMaxLengthInMinutes} minutes.`);
		}
	}

	public getData(): ITrackData {
		return JSON.parse(JSON.stringify(this.trackData));
	}

	public async getAudioResource(): Promise<AudioResource<Track>> {
		if (!this.trackData.url) {
			throw new Error("Invalid track.");
		}

		const process = raw(this.trackData.url, this.downloadFlags, this.downloadOptions);
		if (!process.stdout) {
			throw new Error("No output stream from track.");
		}

		return this.fetchTrackResource(process, process.stdout);
	}

	private fetchTrackResource(process: ExecaChildProcess<string>, stream: Readable): Promise<AudioResource<Track>> {
		return new Promise((resolve, reject) => {
			const onError = (err: Error) => {
				if (!process.killed) {
					process.kill();
				}
				stream.resume();
				return reject(err);
			};

			const onSpawn = () => {
				demuxProbe(stream)
					.then((probe) => resolve(createAudioResource(probe.stream, { metadata: this, inputType: probe.type })))
					.catch(onError);
			};

			process.once("spawn", onSpawn).catch(onError);
		});
	}
}
