import i18n from "i18n";
import { Command } from "../Command";
import { Track } from "../../music/Track";
import { CommandVerb } from "../VerbRegistry";
import { ICommandDescription } from "../models/ICommandDescription";
import { ErrorEmbed } from "../embeds/ErrorEmbed";
import { SuccessEmbed } from "../embeds/SuccessEmbed";
import { MessageEmbed, VoiceChannel } from "discord.js";
import { PlayerLibrary } from "../../music/PlayerLibrary";
import { ITrackFactory, KeywordsTrackFactory, YoutubeTrackFactory } from "../../music/Track/Factories";

export class PlayCommand extends Command {
	private factories: ITrackFactory[] = [new YoutubeTrackFactory(), new KeywordsTrackFactory()];

	constructor() {
		super(CommandVerb.PLAY);
	}

	public async execute({ keywords, member, channel }: ICommandDescription) {
		let embedToSend: MessageEmbed = new MessageEmbed();

		try {
			const searchArg = keywords.join(" ");
			const trackPromises: Promise<Track>[] = this.factories.map((factory) => factory.from(searchArg));
			const track: Track = await Promise.any(trackPromises);

			const playerLibrary = PlayerLibrary.Instance();
			const voiceChannel = member?.voice.channel as VoiceChannel;
			(playerLibrary.getFrom(voiceChannel) || (await playerLibrary.addTo(voiceChannel))).enqueue(track);

			embedToSend = this.successEmbed(track);
		} catch (err) {
			embedToSend = this.errorEmbed(keywords.join(" "));
		} finally {
			channel.send({ embeds: [embedToSend] });
		}
	}

	private successEmbed = (track: Track) =>
		new SuccessEmbed()
			.setTitle(i18n.__("play.added"))
			.setThumbnail(track.getData().thumbnailURL || "")
			.setDescription(`[${track.getData().title}](${track.getData().url})`);

	private errorEmbed = (search: string) => new ErrorEmbed().setDescription(i18n.__("play.notFound", { search }));
}
