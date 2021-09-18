import { GuildMember } from "discord.js";
import { MusicPlayer } from "../../music/MusicPlayer";
import { Command } from "../Command";
import { CommandVerb } from "../VerbRegistry";

export class PauseCommand extends Command {
	constructor() {
		super(CommandVerb.PAUSE);
	}

	public execute(origin: GuildMember, keywords: string[]): void {
		MusicPlayer.Instance().stop();
	}
}
