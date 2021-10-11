import { VoiceChannel } from "discord.js";
import { PlayerLibrary } from "../../music/PlayerLibrary";
import { Command } from "../Command";
import { ICommandDescription } from "../models/ICommandDescription";
import { CommandVerb } from "../VerbRegistry";

export class JoinCommand extends Command {
	constructor() {
		super(CommandVerb.JOIN);
	}

	public async execute({ member }: ICommandDescription) {
		try {
			PlayerLibrary.Instance().addTo(member?.voice.channel as VoiceChannel);
		} catch (err) {
			console.log(err);
		}
	}
}
