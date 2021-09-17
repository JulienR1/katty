import { Track } from "./Track";

export interface IMusicPlayer {
	enqueue(tack: Track): void;
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
