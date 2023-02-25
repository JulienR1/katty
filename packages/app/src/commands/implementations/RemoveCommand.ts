import { MessageEmbed, VoiceChannel } from "discord.js";
import { PlayerLibrary } from "../../music/PlayerLibrary";
import { Command } from "../Command";
import { BotNotConnectedEmbed, ErrorEmbed, SuccessEmbed } from "../embeds";
import { ICommandDescription } from "../models/ICommandDescription";
import { CommandVerb } from "../VerbRegistry";
import i18n from "i18n";

export class RemoveCommand extends Command {
	constructor() {
		super(CommandVerb.REMOVE, i18n.__("description.remove"));
	}

	public execute({ member, channel, keywords }: ICommandDescription): void {
		const musicPlayer = PlayerLibrary.Instance().getFrom(member?.voice.channel as VoiceChannel);
		if (!musicPlayer) {
			channel.send({ embeds: [new BotNotConnectedEmbed()] });
			return;
		}

		if (keywords.length !== 1) {
			channel.send({ embeds: [new ErrorEmbed().setDescription(i18n.__("remove.wrongFormat"))] });
			return;
		}

		const songNumber = parseInt(keywords[0]);

		if (songNumber === 0) {
			channel.send({ embeds: [new ErrorEmbed().setDescription(i18n.__("remove.playingSong"))] });
			return;
		}

		let embedToSend = new MessageEmbed();
		try {
			const songs = musicPlayer.getQueue();
			musicPlayer.remove(songNumber);

			embedToSend = this.successEmbed(songs[songNumber].title);
		} catch (err) {
			embedToSend = this.errorEmbed(songNumber);
		} finally {
			channel.send({ embeds: [embedToSend] });
		}
	}

	private successEmbed = (songTitle: string) =>
		new SuccessEmbed().setTitle(i18n.__("remove.title", { song: songTitle }));

	private errorEmbed = (songNumber: number) =>
		new ErrorEmbed().setDescription(i18n.__("remove.error", { songNumber: songNumber.toString() }));
}
