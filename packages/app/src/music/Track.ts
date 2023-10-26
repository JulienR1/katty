import { createAudioResource } from "@discordjs/voice";
import play from "play-dl";

export interface TrackInfo {
  url: string;
  thumbnailUrl?: string;
  title: string;
  duration: number;
  channel: { name: string; url?: string; iconUrl?: string };
  views: number;
  likes: number;
}

export class Track {
  public constructor(public info: TrackInfo) {}

  public async getAudioResource() {
    const audio = await play.stream(this.info.url);
    return createAudioResource(audio.stream, { inputType: audio.type });
  }

  public clone(): Track {
    return new Track({ ...this.info });
  }
}
