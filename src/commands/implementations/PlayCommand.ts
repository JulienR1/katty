import i18n from "i18n";
import { Command } from "../Command";
import { ITrack, TrackError } from "../../music/Track";
import { CommandVerb } from "../VerbRegistry";
import { ICommandDescription } from "../models/ICommandDescription";
import { MessageEmbed, TextBasedChannels, VoiceChannel } from "discord.js";
import { PlayerLibrary } from "../../music/PlayerLibrary";
import * as factories from "../../music/Track/Factories";
import { ErrorEmbed, GoodbyeEmbed, SuccessEmbed } from "../embeds";
import config from "./../../config.json";

export class PlayCommand extends Command {
	constructor() {
		super(CommandVerb.PLAY, i18n.__("description.play"));
	}

	public async execute({ keywords, member, channel }: ICommandDescription) {
		let embedToSend: MessageEmbed = new MessageEmbed();

		try {
			const searchArg = keywords.join(" ");
			const trackPromises: Promise<ITrack[]>[] = Object.values(factories).map((factory) =>
				factory.prototype.from(searchArg)
			);

			const tracks: ITrack[] = await Promise.any(trackPromises);

			const playerLibrary = PlayerLibrary.Instance();
			const voiceChannel = member?.voice.channel as VoiceChannel;
			(
				playerLibrary.getFrom(voiceChannel) ||
				(await playerLibrary.addTo(voiceChannel, () => this.goodbyeEmbed(channel, voiceChannel)))
			).enqueue(tracks);

			embedToSend = this.successEmbed(tracks[0]);
		} catch (err: unknown) {
			if (err instanceof AggregateError && err.errors.find((error) => error instanceof TrackError)) {
				embedToSend = this.tooLongEmbed();
			} else {
				embedToSend = this.errorEmbed(keywords.join(" "));
			}
		} finally {
			channel.send({ embeds: [embedToSend] });
		}
	}

	// TODO: render when many songs have been added.
	private successEmbed = (track: ITrack) =>
		new SuccessEmbed()
			.setTitle(i18n.__("play.added"))
			.setThumbnail(track.getData().thumbnailURL || "")
			.setDescription(`[${track.getData().title}](${track.getData().url})`);

	private errorEmbed = (search: string) => new ErrorEmbed().setDescription(i18n.__("play.notFound", { search }));

	private tooLongEmbed = () =>
		new ErrorEmbed().setDescription(i18n.__("play.tooLong", { maxTime: config.songMaxLengthInMinutes.toString() }));

	private goodbyeEmbed = (channel: TextBasedChannels, voiceChannel: VoiceChannel) => {
		if (voiceChannel.members.size > 1 && config.voiceCommunication.notifyOnLeave) {
			channel.send({ embeds: [new GoodbyeEmbed(voiceChannel)] });
		}
	};
}
