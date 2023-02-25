import { VoiceChannel } from "discord.js";
import { PlayerLibrary } from "../../music/PlayerLibrary";
import { Command } from "../Command";
import { ICommandDescription } from "../models/ICommandDescription";
import { CommandVerb } from "../VerbRegistry";
import i18n from "i18n";

export class KickCommand extends Command {
	constructor() {
		super(CommandVerb.KICK, i18n.__("description.kick"));
	}

	public execute({ member }: ICommandDescription): void {
		try {
			PlayerLibrary.Instance().removeFrom(member?.voice.channel as VoiceChannel);
		} catch (err) {
			console.log(err);
		}
	}
}
