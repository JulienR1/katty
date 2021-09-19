import i18n from "i18n";
import { TextBasedChannels } from "discord.js";
import { MusicPlayer } from "../../music/MusicPlayer";
import { Command } from "../Command";
import { ErrorEmbed } from "../embeds/ErrorEmbed";
import { SuccessEmbed } from "../embeds/SuccessEmbed";
import { ICommandDescription } from "../models/ICommandDescription";
import { CommandVerb } from "../VerbRegistry";
import { Track } from "../../music/Track";

export class NextCommand extends Command {
	constructor() {
		super(CommandVerb.NEXT);
	}

	public execute({ channel }: ICommandDescription): void {
		try {
			const queue = MusicPlayer.Instance().queue();
			const callback = queue.length > 1 ? () => this.onNextError(channel) : () => {};

			MusicPlayer.Instance().bindToSongEndErrors(this.verb, callback);
			MusicPlayer.Instance().next();
			channel.send({
				embeds: [queue.length > 1 ? this.nextSongEmbed(queue[1]) : this.noMoreSongEmbed()],
			});
		} catch (err) {
			this.onNextError(channel);
		}
	}

	private onNextError(channel: TextBasedChannels) {
		channel.send({ embeds: [new ErrorEmbed().setDescription(i18n.__("next.emptyQueue"))] });
	}

	private nextSongEmbed = (track: Track) =>
		new SuccessEmbed()
			.setTitle(i18n.__("next.skipped"))
			.setDescription(`${i18n.__("next.nextSong")}\n[${track.title}](${track.url})`);

	private noMoreSongEmbed = () =>
		new SuccessEmbed().setTitle(i18n.__("next.skipped")).setDescription(i18n.__("next.emptyQueue"));
}
