import { Command } from "../Command";
import { Track } from "../../music/Track";
import { MusicPlayer } from "../../music/MusicPlayer";
import { CommandVerb } from "../VerbRegistry";
import { ICommandDescription } from "../models/ICommandDescription";

export class PlayCommand extends Command {
	constructor() {
		super(CommandVerb.PLAY);
	}

	public async execute({ keywords, member }: ICommandDescription) {
		let track: Track | undefined = undefined;
		try {
			track = await new Track().fromURL(keywords[0]);
		} catch (err) {
			track = await new Track().fromKeywords(keywords);
		} finally {
			if (track) {
				MusicPlayer.Instance().enqueue(member.voice.channel, track);
			}
		}
	}
}
