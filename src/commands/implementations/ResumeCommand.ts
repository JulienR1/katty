import { VoiceChannel } from "discord.js";
import i18n from "i18n";
import { PlayerLibrary } from "../../music/PlayerLibrary";
import { Command } from "../Command";
import { ErrorEmbed, SuccessEmbed, BotNotConnectedEmbed } from "../embeds";
import { ICommandDescription } from "../models/ICommandDescription";
import { CommandVerb } from "../VerbRegistry";

export class ResumeCommand extends Command {
	constructor() {
		super(CommandVerb.RESUME, i18n.__("description.resume"));
	}

	public execute({ channel, member }: ICommandDescription): void {
		const musicPlayer = PlayerLibrary.Instance().getFrom(member?.voice.channel as VoiceChannel);
		if (!musicPlayer) {
			channel.send({ embeds: [new BotNotConnectedEmbed()] });
			return;
		}

		try {
			musicPlayer.togglePause(false);
			channel.send({ embeds: [new SuccessEmbed().setTitle(i18n.__("resume"))] });
		} catch (err) {
			channel.send({ embeds: [new ErrorEmbed().setDescription(i18n.__("errorDescription"))] });
		}
	}
}
