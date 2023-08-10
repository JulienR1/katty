import { Playlist } from "../music/Playlist";
import { TrackFactoryResult } from "../music/TrackFactory";
import { SuccessEmbed } from "./SuccessEmbed";
import { LostTravolta } from "./utils/attachments";
import { formatTime } from "./utils/formatters";

export class PlaylistInfoEmbed extends SuccessEmbed {
  public constructor(
    { playlistInfo, tracks }: TrackFactoryResult & { type: "playlist" },
    activePlaylist: Playlist
  ) {
    super();

    const [travolta, travoltaURL] = LostTravolta();

    const formatter = new Intl.NumberFormat("en-CA", { notation: "compact" });

    const activePlaylistDuration =
      activePlaylist.totalDuration() - playlistInfo.duration;
    const timeToPlay =
      activePlaylistDuration === 0
        ? "now"
        : `in ${formatTime(activePlaylistDuration)}`;

    this.setTitle(playlistInfo.title);
    this.setDescription(`Added ${tracks.length} tracks to the playlist.`);
    this.setAuthor(playlistInfo.channel);
    this.setThumbnail(playlistInfo.thumbnailUrl ?? travoltaURL);
    this.setURL(playlistInfo.url);
    this.setFooter({ text: `Scheduled to play ${timeToPlay}` });
    this.setFields([
      {
        name: "Duration",
        value: formatTime(playlistInfo.duration),
        inline: true,
      },
      {
        name: "Views",
        value: formatter.format(playlistInfo.views),
        inline: true,
      },
      { name: "Videos", value: tracks.length.toString(), inline: true },
    ]);

    if (!playlistInfo.thumbnailUrl) {
      this.files.push(travolta);
    }
  }
}
