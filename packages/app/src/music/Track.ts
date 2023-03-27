import { createAudioResource } from "@discordjs/voice";
import play from "play-dl";
import { isPlaylist } from "./utils";

interface TrackInfo {
  url: string;
  thumbnailUrl?: string;
  title: string;
  duration: number;
}

export class Track {
  private constructor(public info: TrackInfo) {}

  public static async make(url: string): Promise<Track[]> {
    const videos = [];

    if (isPlaylist(url)) {
      const playlist = await play.playlist_info(url);
      const playlistVideos = await playlist.all_videos();
      videos.push(...playlistVideos);
    } else {
      const { video_details } = await play.video_info(url);
      videos.push(video_details);
    }

    return videos.map(
      (details) =>
        new Track({
          url: details.url,
          duration: details.durationInSec,
          title: details.title ?? "Unknown title",
          thumbnailUrl: details.thumbnails[0].url,
        })
    );
  }

  public async getAudioResource() {
    const audio = await play.stream(this.info.url);
    return createAudioResource(audio.stream, { inputType: audio.type });
  }
}
