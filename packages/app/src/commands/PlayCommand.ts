import { DiscordCommand, HandleCommandParams } from "discord-command-handler";
import { AutocompleteInteraction } from "discord.js";
import play from "play-dl";
import { ErrorEmbed } from "../embeds/ErrorEmbed";
import { PlaylistInfoEmbed } from "../embeds/PlaylistInfoEmbed";
import { TrackInfoEmbed } from "../embeds/TrackInfoEmbed";
import { formatField, formatTitle } from "../embeds/utils/formatters";
import { respond } from "../embeds/utils/responses";
import { MusicPlayer } from "../music/MusicPlayer";
import { TrackFactory } from "../music/TrackFactory";
import { isPlaylist, isUrl } from "../music/utils";

@DiscordCommand({
  name: "play",
  description: "Request a song to play",
  extra: (builder) =>
    builder.addStringOption((option) =>
      option
        .setName("query")
        .setDescription("Search query")
        .setRequired(true)
        .setAutocomplete(true)
    ),
})
export class PlayCommand {
  public async autocomplete(interaction: AutocompleteInteraction) {
    const query = interaction.options.getFocused();

    if (!isUrl(query)) {
      const videos = await play.search(query, { limit: 5 });
      const options = videos.map((video) => ({
        value: video.url,
        name: video.title ?? "Unknown title",
      }));

      await interaction.respond(options);
      return;
    }

    if (isPlaylist(query)) {
      const playlist = await play.playlist_info(query);
      const option = {
        value: playlist.url!,
        name: playlist.title ?? "Unknown playlist",
      };

      await interaction.respond([option]);
      return;
    }

    const { video_details } = await play.video_basic_info(query);
    const option = {
      value: video_details.url,
      name: video_details.title ?? "Unknown video",
    };

    await interaction.respond([option]);
    return;
  }

  public async handle({ interaction, voiceChannel }: HandleCommandParams) {
    const query = interaction.options.getString("query", true);
    const loadingStr = isUrl(query)
      ? "Fetching track from url"
      : `Fetching "**${formatTitle(query, 15)}**"`;
    const response = await respond(interaction).acknowledge(loadingStr);

    const result = await TrackFactory.fromQuery(query);
    if (result.type === "no-track") {
      return await response.edit(this.makeErrorEmbed(query));
    }

    const musicPlayer = MusicPlayer.fromGuild(voiceChannel.guildId);

    if (result.type === "single-track") {
      musicPlayer.playlist.add(result.track);
      await response.edit(
        new TrackInfoEmbed(result.track.info, musicPlayer.playlist, query)
      );
    } else {
      musicPlayer.playlist.add(...result.tracks);
      await response.edit(new PlaylistInfoEmbed(result, musicPlayer.playlist));
    }

    await musicPlayer.join(voiceChannel);
    await musicPlayer.playTrack();
  }

  private makeErrorEmbed(query: string) {
    return new ErrorEmbed()
      .setTitle("Could not find any tracks")
      .setFields([{ name: "Query", value: formatField(query) }])
      .setTimestamp();
  }
}
