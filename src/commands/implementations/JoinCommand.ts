import { GuildMember, VoiceChannel } from "discord.js";
import { MusicPlayer } from "../../music/MusicPlayer";
import { Command } from "../Command";
import { CommandVerb } from "../VerbRegistry";

export class JoinCommand extends Command {
	constructor() {
		super(CommandVerb.JOIN);
	}

	public async execute(origin: GuildMember, keywords: string[]) {
		MusicPlayer.Instance().join(origin.voice.channel as VoiceChannel);
	}
}
