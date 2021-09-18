import { GuildMember } from "discord.js";
import { MusicPlayer } from "../../music/MusicPlayer";
import { Command } from "../Command";
import { CommandVerb } from "../VerbRegistry";

export class QueueCommand extends Command {
	constructor() {
		super(CommandVerb.QUEUE);
	}

	execute(origin: GuildMember, keywords: string[]): void {
		console.log("queue: ", MusicPlayer.Instance().queue());
	}
}
