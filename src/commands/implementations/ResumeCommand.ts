import i18n from "i18n";
import { MusicPlayer } from "../../music/MusicPlayer";
import { Command } from "../Command";
import { ErrorEmbed } from "../embeds/ErrorEmbed";
import { SuccessEmbed } from "../embeds/SuccessEmbed";
import { ICommandDescription } from "../models/ICommandDescription";
import { CommandVerb } from "../VerbRegistry";

export class ResumeCommand extends Command {
	constructor() {
		super(CommandVerb.RESUME);
	}

	public execute({ channel }: ICommandDescription): void {
		try {
			MusicPlayer.Instance().resume();
			channel.send({ embeds: [new SuccessEmbed().setTitle(i18n.__("resume"))] });
		} catch (err) {
			channel.send({ embeds: [new ErrorEmbed().setDescription(i18n.__("errorDescription"))] });
		}
	}
}
