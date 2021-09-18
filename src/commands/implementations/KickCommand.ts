import { GuildMember } from "discord.js";
import { MusicPlayer } from "../../music/MusicPlayer";
import { Command } from "../Command";
import { CommandVerb } from "../VerbRegistry";

export class KickCommand extends Command {
	constructor() {
		super(CommandVerb.KICK);
	}

	public execute(origin: GuildMember, keywords: string[]): void {
		MusicPlayer.Instance().leave();
	}
}
