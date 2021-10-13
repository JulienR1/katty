import { Helpers } from "../Helpers";
import { ITrack, ITrackData } from "../ITrack";
import { ITrackFactory } from "./ITrackFactory";
import ytSearch from "yt-search";
import { Track } from "../Track";

export class KeywordsTrackFactory implements ITrackFactory {
	public from(arg: string): Promise<ITrack[]> {
		const keywords = arg;

		return new Promise(async (resolve, reject) => {
			if (!Helpers.isKeywords(keywords)) {
				return reject(new Error("The provided keywords are not valid."));
			}

			const searchResult = await ytSearch(keywords);
			if (searchResult.videos.length === 0) {
				return reject(new Error("The provided search params did not return anyting."));
			}

			const videoData = searchResult.videos[0];
			const trackData: ITrackData = {
				title: videoData.title,
				url: videoData.url,
				thumbnailURL: videoData.thumbnail,
				lengthSeconds: videoData.seconds.toString(),
			};

			return resolve([new Track(trackData)]);
		});
	}
}
