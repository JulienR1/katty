import play, { YouTubeChannel, YouTubePlayList, YouTubeVideo } from "play-dl";
import { Track, TrackInfo } from "./Track";
import { isPlaylist, isUrl } from "./utils";

export type TrackFactoryResult =
  | { type: "no-track" }
  | { type: "single-track"; track: Track }
  | { type: "playlist"; tracks: Track[]; playlistInfo: TrackInfo };

export class TrackFactory {
  public static async fromQuery(query: string): Promise<TrackFactoryResult> {
    if (isUrl(query)) {
      return this.fromUrl(query);
    }

    try {
      const videos = await play.search(query);
      if (videos.length !== 0) {
        return this.fromUrl(videos[0].url);
      }
    } catch (ex) {
      console.error(ex);
    }

    return { type: "no-track" };
  }

  public static async fromUrl(url: string): Promise<TrackFactoryResult> {
    try {
      if (isPlaylist(url)) {
        const playlist = await play.playlist_info(url);
        const playlistVideos = await playlist.all_videos();

        const tracks = playlistVideos.map((video) => this.parseVideo(video));
        const playlistInfo = this.parsePlaylistInfo(playlist, playlistVideos);

        return { type: "playlist", tracks, playlistInfo };
      } else {
        const { video_details } = await play.video_info(url);
        const track = this.parseVideo(video_details);

        return { type: "single-track", track };
      }
    } catch (ex) {
      console.error(ex);
    }

    return { type: "no-track" };
  }

  private static parseVideo(video: YouTubeVideo): Track {
    return new Track({
      url: video.url,
      duration: video.durationInSec,
      title: video.title ?? "Unknown title",
      thumbnailUrl: video.thumbnails[0].url,
      channel: this.parseChannel(video.channel),
      views: video.views,
      likes: video.likes,
    });
  }

  private static parsePlaylistInfo(
    playlist: YouTubePlayList,
    videos: YouTubeVideo[]
  ): TrackInfo {
    return {
      url: playlist.url ?? "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      duration: videos.reduce((sum, video) => sum + video.durationInSec, 0),
      title: playlist.title ?? "Unknown playlist",
      thumbnailUrl: playlist.thumbnail?.url,
      channel: this.parseChannel(playlist.channel),
      views: playlist.views ?? 0,
      likes: 0,
    };
  }

  private static parseChannel(channel?: YouTubeChannel): TrackInfo["channel"] {
    return {
      name: channel?.name ?? "Unknown channel",
      url: channel?.url,
      iconUrl: channel?.icons?.[0].url,
    };
  }
}
