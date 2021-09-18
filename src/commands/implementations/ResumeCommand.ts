import { GuildMember } from "discord.js";
import { MusicPlayer } from "../../music/MusicPlayer";
import { Command } from "../Command";
import { CommandVerb } from "../VerbRegistry";

export class ResumeCommand extends Command {
	constructor() {
		super(CommandVerb.RESUME);
	}

	public execute(origin: GuildMember, keywords: string[]): void {
		MusicPlayer.Instance().resume();
	}
}
