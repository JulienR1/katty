import { VoiceChannel } from "discord.js";
import { Track } from "./Track";

export interface IMusicPlayer {
	join(channel: VoiceChannel): void;
	enqueue(channel: VoiceChannel, tack: Track): void;
	leave(): void;
	play(): void;
	next(): void;
	stop(): void;
	resume(): void;
	/**
	 * queue (afficher)
	 * loop
	 * seek (in music)
	 * reorder
	 * remove
	 * clear
	 */
}
