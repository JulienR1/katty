import { VoiceChannel } from "discord.js";
import { Track } from "./Track";

export interface IMusicPlayer {
	joinChannel(channel: VoiceChannel): void;
	enqueue(channel: VoiceChannel, tack: Track): void;
	/**
	 * enqueue
	 * pause
	 * skip
	 * queue (afficher)
	 * loop
	 * seek (in music)
	 * reorder
	 * remove
	 */
}
