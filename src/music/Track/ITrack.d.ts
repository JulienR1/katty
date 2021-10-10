import { AudioResource } from "@discordjs/voice";

export interface ITrackData {
	title: string;
	url: string;
	thumbnailURL: string;
	lengthSeconds: string;
}

export interface ITrack {
	getAudioResource(): Promise<AudioResource>;
	getData(): ITrackData;
}
