import { DiscordCommand, HandleCommandParams } from "discord-command-handler";
import { AutocompleteInteraction } from "discord.js";
import play from "play-dl";
import { MusicPlayer } from "../music/MusicPlayer";
import { Track } from "../music/Track";
import { isPlaylist, isUrl } from "../music/utils";
import { acknowledge, refuse } from "../responses";

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
    if (!voiceChannel) {
      return await refuse(interaction, "bot-not-connected");
    }

    const editReply = await acknowledge(interaction);

    const query = interaction.options.getString("query", true);
    const url = await this.getUrlFromQuery(query);
    const tracks = await Track.make(url);

    if (tracks.length === 0) {
      return await editReply.edit("Could not find any songs. Aborting.");
    } else if (tracks.length === 1) {
      await editReply.edit(`Adding ${tracks[0].info.title} to the playlist.`);
    } else {
      await editReply.edit(`Adding ${tracks.length} songs to the playlist.`);
    }

    const musicPlayer = MusicPlayer.fromGuild(voiceChannel.guildId);
    musicPlayer.playlist.add(...tracks);
    await musicPlayer.join(voiceChannel);
    await musicPlayer.playTrack();

    await editReply.edit("started playing: " + tracks[0].info.title);
  }

  private async getUrlFromQuery(query: string) {
    if (isUrl(query)) {
      return query;
    }

    const videoUrls = await play.search(query);
    return videoUrls[0].url;
  }
}
