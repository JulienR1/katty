import i18n from "i18n";
import { MusicPlayer } from "../../music/MusicPlayer";
import { Command } from "../Command";
import { ErrorEmbed } from "../embeds/ErrorEmbed";
import { SuccessEmbed } from "../embeds/SuccessEmbed";
import { ICommandDescription } from "../models/ICommandDescription";
import { CommandVerb } from "../VerbRegistry";

export class PauseCommand extends Command {
	constructor() {
		super(CommandVerb.PAUSE);
	}

	public execute({ channel }: ICommandDescription): void {
		try {
			MusicPlayer.Instance().stop();
			channel.send({ embeds: [new SuccessEmbed().setTitle(i18n.__("pause"))] });
		} catch (err) {
			channel.send({ embeds: [new ErrorEmbed().setDescription(i18n.__("errorDescription"))] });
		}
	}
}
