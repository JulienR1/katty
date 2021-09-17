import { IMusicPlayer } from "./IMusicPlayer";
import { Track } from "./Track";

export class MusicPlayer implements IMusicPlayer {
	private static instance: MusicPlayer | undefined;
	private trackQueue: Track[] = [];

	private constructor() {}

	public static Instance(): MusicPlayer {
		if (MusicPlayer.instance === undefined) {
			MusicPlayer.instance = new MusicPlayer();
		}
		return MusicPlayer.instance;
	}

	public enqueue(track: Track) {
		console.log("Adding track to the queue: ", track);
		this.trackQueue.push(track);
	}
}
