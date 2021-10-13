import { VoiceChannel } from "discord.js";
import { PlayerLibrary } from "../../music/PlayerLibrary";
import { Command } from "../Command";
import { BotNotConnectedEmbed, SuccessEmbed, ErrorEmbed } from "../embeds";
import { ICommandDescription } from "../models/ICommandDescription";
import { CommandVerb } from "../VerbRegistry";
import i18n from "i18n";

export class ClearCommand extends Command {
	constructor() {
		super(CommandVerb.CLEAR);
	}

	public async execute({ member, channel }: ICommandDescription) {
		const musicPlayer = PlayerLibrary.Instance().getFrom(member?.voice.channel as VoiceChannel);
		if (!musicPlayer) {
			channel.send({ embeds: [new BotNotConnectedEmbed()] });
			return;
		}

		try {
			musicPlayer.clear();
			channel.send({ embeds: [new SuccessEmbed().setDescription(i18n.__("clear"))] });
		} catch (err) {
			console.log(err);
			channel.send({ embeds: [new ErrorEmbed()] });
		}
	}
}
