import ytpl from "ytpl";
import { ITrackFactory } from ".";
import { ITrack, Track } from "..";
import { Helpers } from "../Helpers";

export class YoutubePlaylistTrackFactory implements ITrackFactory {
	public from(arg: string): Promise<ITrack[]> {
		const url = arg;

		return new Promise(async (resolve, reject) => {
			if (!Helpers.isYoutubePlaylist(url)) {
				return reject(new Error("The provided url is not a YouTube playlist."));
			}

			const { items } = await ytpl(url, { limit: Infinity });
			const tracks: ITrack[] = items.map(
				(playlistItem) =>
					new Track({
						title: playlistItem.title,
						url: playlistItem.shortUrl,
						thumbnailURL: playlistItem.thumbnails[1].url || "",
						lengthSeconds: playlistItem.durationSec?.toString() || "0",
					})
			);

			return resolve(tracks);
		});
	}
}
