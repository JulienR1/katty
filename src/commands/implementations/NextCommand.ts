import { GuildMember } from "discord.js";
import { MusicPlayer } from "../../music/MusicPlayer";
import { Command } from "../Command";
import { CommandVerb } from "../VerbRegistry";

export class NextCommand extends Command {
	constructor() {
		super(CommandVerb.NEXT);
	}

	public execute(origin: GuildMember, keywords: string[]): void {
		MusicPlayer.Instance().next();
	}
}
