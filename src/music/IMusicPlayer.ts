import { VoiceChannel } from "discord.js";
import { Track } from "./Track";

export interface IMusicPlayer {
	join(channel: VoiceChannel): void;
	leave(): void;
	enqueue(channel: VoiceChannel, tack: Track): void;
	play(): void;
	next(): void;
	stop(): void;
	resume(): void;
	queue(): void;
	/**
	 * loop
	 * seek (in music)
	 * reorder
	 * remove
	 * clear
	 */
}
