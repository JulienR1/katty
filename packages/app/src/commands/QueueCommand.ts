import { DiscordCommand, HandleCommandParams } from "discord-command-handler";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { CustomEmbedBuilder } from "../embeds/CustomEmbedBuilder";
import { ErrorEmbed } from "../embeds/ErrorEmbed";
import { QueueEmbed } from "../embeds/QueueEmbed";
import { respond } from "../embeds/utils/responses";
import { MusicPlayer } from "../music/MusicPlayer";
import { Playlist } from "../music/Playlist";
import { Track, TrackInfo } from "../music/Track";

const PAGE_SIZE = 9;

const BUTTON_EVENTS = {
  previous: "queue-previous-page",
  next: "queue-next-page",
  refresh: "queue-refresh-page",
} as const;

type PageStatus = {
  currentTrack: TrackInfo | undefined;
  tracks: Track[];
  page: number;
  pageCount: number;
};

@DiscordCommand({
  name: "queue",
  description: "Get the current tracks in the playlist.",
})
export class QueueCommand {
  public async handle({ interaction, voiceChannel }: HandleCommandParams) {
    const response = await respond(interaction).acknowledge("Coming up!");

    let currentPage = 0;
    const musicPlayer = MusicPlayer.fromGuild(voiceChannel.guildId);

    const collector = response.message.createMessageComponentCollector({
      filter: (i) =>
        i.customId === BUTTON_EVENTS.next ||
        i.customId === BUTTON_EVENTS.refresh ||
        i.customId === BUTTON_EVENTS.previous,
      time: 2 * 60 * 1000,
    });

    collector?.on("collect", async (i) => {
      await i.deferUpdate();

      switch (i.customId) {
        case BUTTON_EVENTS.previous:
          currentPage--;
          break;
        case BUTTON_EVENTS.refresh:
          break;
        case BUTTON_EVENTS.next:
          currentPage++;
          break;
        default:
          await i.editReply({
            embeds: [new ErrorEmbed().setTitle("Something went wrong")],
            components: [],
          });
          break;
      }

      const status = this.getTracks(currentPage, musicPlayer.playlist);
      const embed = this.generateResponseEmbed(status);
      currentPage = status.page;

      await i.editReply({
        embeds: [embed],
        components: embed.components,
        files: embed.files,
      });
    });

    collector?.on("end", async () => {
      await interaction.editReply({ components: [] });
    });

    const status = this.getTracks(currentPage, musicPlayer.playlist);
    const embed = this.generateResponseEmbed(status);
    await response.edit(embed);
  }

  private getTracks(page: number, playlist: Playlist): PageStatus {
    const tracks = playlist.getAll();

    const startIndex = page * PAGE_SIZE;
    const endIndex = Math.min((page + 1) * PAGE_SIZE, tracks.length);
    const pageCount = Math.floor(tracks.length / PAGE_SIZE);

    return {
      currentTrack: tracks[0]?.info,
      tracks: tracks.slice(startIndex, endIndex),
      pageCount,
      page,
    };
  }

  private generateResponseEmbed(status: PageStatus): CustomEmbedBuilder {
    const buttons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(BUTTON_EVENTS.previous)
        .setLabel("Previous page")
        .setStyle(ButtonStyle.Primary)
        .setDisabled(status.page <= 0),
      new ButtonBuilder()
        .setCustomId(BUTTON_EVENTS.refresh)
        .setLabel("Refresh page")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId(BUTTON_EVENTS.next)
        .setLabel("Next page")
        .setStyle(ButtonStyle.Primary)
        .setDisabled(status.page >= status.pageCount)
    );

    const numberedTracks = status.tracks.map((track, i) => ({
      ...track.info,
      position: i + status.page * PAGE_SIZE + 1,
    }));
    return new QueueEmbed(status.currentTrack, numberedTracks, buttons);
  }
}
