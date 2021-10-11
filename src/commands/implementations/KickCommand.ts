import { VoiceChannel } from "discord.js";
import { PlayerLibrary } from "../../music/PlayerLibrary";
import { Command } from "../Command";
import { ICommandDescription } from "../models/ICommandDescription";
import { CommandVerb } from "../VerbRegistry";

export class KickCommand extends Command {
	constructor() {
		super(CommandVerb.KICK);
	}

	public execute({ member }: ICommandDescription): void {
		try {
			PlayerLibrary.Instance().removeFrom(member?.voice.channel as VoiceChannel);
		} catch (err) {
			console.log(err);
		}
	}
}
