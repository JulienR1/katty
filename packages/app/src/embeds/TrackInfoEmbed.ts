import { Playlist } from "../music/Playlist";
import { TrackInfo } from "../music/Track";
import { isUrl } from "../music/utils";

import { SuccessEmbed } from "./SuccessEmbed";
import { LostTravolta } from "./utils/attachments";
import { formatFooter, formatTime, formatTitle } from "./utils/formatters";

export class TrackInfoEmbed extends SuccessEmbed {
  public constructor(
    trackInfo: TrackInfo,
    playlist: Playlist,
    query: string | null
  ) {
    super();

    const [travolta, travoltaURL] = LostTravolta();

    const formatter = new Intl.NumberFormat("en-CA", { notation: "compact" });

    const duration = formatTime(trackInfo.duration);
    const playlistDuration = Math.max(
      0,
      playlist.totalDuration() - trackInfo.duration
    );
    const timeToPlay =
      playlistDuration === 0 ? "now" : `in ${formatTime(playlistDuration)}`;

    this.setThumbnail(trackInfo.thumbnailUrl ?? travoltaURL);
    this.setTitle(formatTitle(trackInfo.title));
    this.setAuthor(trackInfo.channel);
    this.setURL(trackInfo.url);
    this.setFooter({
      text: `Scheduled to play ${timeToPlay} • ${
        query
          ? isUrl(query)
            ? `Added with url`
            : `Added with query: "${formatFooter(query, 70)}" `
          : "Added automatically"
      }`,
    });
    this.setFields([
      { name: "Duration", value: duration, inline: true },
      {
        name: "Views",
        value: formatter.format(trackInfo.views),
        inline: true,
      },
      {
        name: "Likes",
        value: formatter.format(trackInfo.likes),
        inline: true,
      },
    ]);

    if (!trackInfo.thumbnailUrl) {
      this.files.push(travolta);
    }
  }
}
