import { MessageEmbed, VoiceChannel } from "discord.js";
import { PlayerLibrary } from "../../music/PlayerLibrary";
import { Command } from "../Command";
import { BotNotConnectedEmbed, ErrorEmbed, SuccessEmbed } from "../embeds";
import { ICommandDescription } from "../models/ICommandDescription";
import { CommandVerb } from "../VerbRegistry";
import i18n from "i18n";

export class MoveCommand extends Command {
	constructor() {
		super(CommandVerb.MOVE, i18n.__("description.move"));
	}

	public execute({ member, channel, keywords }: ICommandDescription): void {
		const musicPlayer = PlayerLibrary.Instance().getFrom(member?.voice.channel as VoiceChannel);
		if (!musicPlayer) {
			channel.send({ embeds: [new BotNotConnectedEmbed()] });
			return;
		}

		if (keywords.length !== 2) {
			channel.send({ embeds: [new ErrorEmbed().setDescription(i18n.__("move.wrongFormat"))] });
			return;
		}

		const [startIndex, targetIndex] = keywords.map((keyword) => parseInt(keyword));

		if (startIndex === targetIndex) {
			channel.send({ embeds: [new ErrorEmbed().setDescription(i18n.__("move.noSwap"))] });
			return;
		}

		if (startIndex === 0 || targetIndex === 0) {
			channel.send({ embeds: [new ErrorEmbed().setDescription(i18n.__("move.playingSong"))] });
			return;
		}

		let embedToSend = new MessageEmbed();
		try {
			const songs = musicPlayer.getQueue();
			musicPlayer.move(startIndex, targetIndex);

			embedToSend = this.successEmbed(songs[startIndex].title, targetIndex);
		} catch (err) {
			embedToSend = this.errorEmbed(startIndex, targetIndex);
		} finally {
			channel.send({ embeds: [embedToSend] });
		}
	}

	private successEmbed = (song: string, position: number) =>
		new SuccessEmbed().setTitle(i18n.__("move.title", { song, position: position.toString() }));

	private errorEmbed = (startIndex: number, targetIndex: number) =>
		new ErrorEmbed().setDescription(
			i18n.__("move.error", { startIndex: startIndex.toString(), targetIndex: targetIndex.toString() })
		);
}
