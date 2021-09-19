import i18n from "i18n";
import { Command } from "../Command";
import { Track } from "../../music/Track";
import { MusicPlayer } from "../../music/MusicPlayer";
import { CommandVerb } from "../VerbRegistry";
import { ICommandDescription } from "../models/ICommandDescription";
import { ErrorEmbed } from "../embeds/ErrorEmbed";
import { SuccessEmbed } from "../embeds/SuccessEmbed";

export class PlayCommand extends Command {
	constructor() {
		super(CommandVerb.PLAY);
	}

	public async execute({ keywords, member, channel }: ICommandDescription) {
		const track: Track | undefined = await new Promise((resolve) => {
			new Track()
				.fromURL(keywords[0])
				.then((track) => resolve(track))
				.catch(() => {
					new Track()
						.fromKeywords(keywords)
						.then((track) => resolve(track))
						.catch(() => resolve(undefined));
				});
		});

		if (track) {
			MusicPlayer.Instance().enqueue(member.voice.channel, track);
		}

		const embedToSend = track ? this.successEmbed(track) : this.errorEmbed(keywords.join(" "));
		channel.send({ embeds: [embedToSend] });
	}

	private successEmbed = (track: Track) =>
		new SuccessEmbed()
			.setTitle(i18n.__("play.added"))
			.setThumbnail(track.thumbnailURL || "")
			.setDescription(`[${track.title}](${track.url})`);

	private errorEmbed = (search: string) => new ErrorEmbed().setDescription(i18n.__("play.notFound", { search }));
}
