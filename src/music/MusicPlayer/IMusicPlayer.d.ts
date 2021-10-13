import { VoiceChannel } from "discord.js";
import { ITrack, ITrackData } from "../Track";

export interface IMusicPlayer {
	isVoiceConnected(channel: VoiceChannel): boolean;
	getIsLooping(): boolean;

	join(channel: VoiceChannel): Promise<IMusicPlayer>;
	leave(): void;

	enqueue(track: ITrack): IMusicPlayer;
	togglePause(isPausing: boolean): IMusicPlayer;
	toggleLoop(): IMusicPlayer;

	next(): IMusicPlayer;
	clear(): IMusicPlayer;
	/******** TODO */
	move(trackIndex: number, targetIndex: number): IMusicPlayer;
	remove(trackIndex: number): IMusicPlayer;
	seek(timestamp: string): IMusicPlayer;
	/************* */

	getQueue(): ITrackData[];
}
