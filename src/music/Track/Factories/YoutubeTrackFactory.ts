import ytdl from "ytdl-core";
import { Helpers } from "../Helpers";
import { ITrack, ITrackData } from "../ITrack";
import { Track } from "../Track";
import { ITrackFactory } from "./ITrackFactory";

export class YoutubeTrackFactory implements ITrackFactory {
	public from(arg: string): Promise<ITrack> {
		const url = arg;

		return new Promise(async (resolve, reject) => {
			if (!Helpers.isYoutube(url)) {
				return reject(new Error("The provided url is not a YouTube url."));
			}

			if (Helpers.isYoutubePlaylist(url)) {
				return reject(new Error("The provided url is a playlist. Use a playlist factory."));
			}

			if (!ytdl.validateURL(url)) {
				return reject(new Error("The provided url was found to be invalid."));
			}

			const trackInfo = await ytdl.getBasicInfo(url);
			const trackData: ITrackData = {
				title: trackInfo.videoDetails.title,
				url: trackInfo.videoDetails.video_url,
				thumbnailURL: trackInfo.videoDetails.thumbnails[1].url,
				lengthSeconds: trackInfo.videoDetails.lengthSeconds,
			};

			return resolve(new Track(trackData));
		});
	}
}
