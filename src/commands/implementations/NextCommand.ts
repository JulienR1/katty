import i18n from "i18n";
import { TextBasedChannels, VoiceChannel } from "discord.js";
import { Command } from "../Command";
import { ICommandDescription } from "../models/ICommandDescription";
import { CommandVerb } from "../VerbRegistry";
import { ITrackData } from "../../music/Track";
import { PlayerLibrary } from "../../music/PlayerLibrary";
import { BotNotConnectedEmbed, ErrorEmbed, SuccessEmbed } from "../embeds";

export class NextCommand extends Command {
	constructor() {
		super(CommandVerb.NEXT);
	}

	public execute({ member, channel }: ICommandDescription): void {
		const musicPlayer = PlayerLibrary.Instance().getFrom(member?.voice.channel as VoiceChannel);
		if (!musicPlayer) {
			channel.send({ embeds: [new BotNotConnectedEmbed()] });
			return;
		}

		try {
			musicPlayer.next();
			const playlist = musicPlayer.getQueue();

			channel.send({
				embeds: [playlist.length > 1 ? this.nextSongEmbed(playlist[1]) : this.noMoreSongEmbed()],
			});
		} catch (err) {
			this.onNextError(channel);
		}
	}

	private onNextError(channel: TextBasedChannels) {
		channel.send({ embeds: [new ErrorEmbed().setDescription(i18n.__("next.emptyQueue"))] });
	}

	private nextSongEmbed = (track: ITrackData) =>
		new SuccessEmbed()
			.setTitle(i18n.__("next.skipped"))
			.setDescription(`${i18n.__("next.nextSong")}\n[${track.title}](${track.url})`);

	private noMoreSongEmbed = () =>
		new SuccessEmbed().setTitle(i18n.__("next.skipped")).setDescription(i18n.__("next.emptyQueue"));
}
