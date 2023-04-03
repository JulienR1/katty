import { ActionRowBuilder } from "discord.js";
import { TrackInfo } from "../music/Track";
import { SuccessEmbed } from "./SuccessEmbed";

export class QueueEmbed extends SuccessEmbed {
  public constructor(
    currentTrack: TrackInfo | undefined,
    tracks: (TrackInfo & { position: number })[],
    buttons: ActionRowBuilder
  ) {
    super();

    this.components = [buttons as any];

    if (tracks.length === 0) {
      this.setTitle("The playlist is empty");
    } else {
      this.setFields(
        { name: "Currently playing", value: currentTrack!.title },
        ...tracks.map((track) => ({
          name: track.position + ".",
          value: track.title,
          inline: true,
        }))
      );
    }
  }
}
