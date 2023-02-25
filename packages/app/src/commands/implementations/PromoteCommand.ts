import { VoiceChannel } from "discord.js";
import { PlayerLibrary } from "../../music/PlayerLibrary";
import { Command } from "../Command";
import { BotNotConnectedEmbed } from "../embeds";
import { ICommandDescription } from "../models/ICommandDescription";
import { CommandVerb } from "../VerbRegistry";
import { MoveCommand } from ".";
import i18n from "i18n";

export class PromoteCommand extends Command {
	constructor() {
		super(CommandVerb.PROMOTE, i18n.__("description.promote"));
	}

	public execute({ member, channel, keywords }: ICommandDescription): void {
		const musicPlayer = PlayerLibrary.Instance().getFrom(member?.voice.channel as VoiceChannel);
		if (!musicPlayer) {
			channel.send({ embeds: [new BotNotConnectedEmbed()] });
			return;
		}

		const songsInQueue = musicPlayer.getQueue().length - 1;
		let promotionRequest = keywords[0] || songsInQueue.toString();

		if (["last", "end"].includes(promotionRequest)) {
			promotionRequest = songsInQueue.toString();
		}

		new MoveCommand().execute({ member, channel, keywords: [promotionRequest, "1"] });
	}
}
