import { DiscordCommand, HandleCommandParams } from "discord-command-handler";
import { SuccessEmbed } from "../embeds/SuccessEmbed";
import { TrackInfoEmbed } from "../embeds/TrackInfoEmbed";
import { respond } from "../embeds/utils/responses";
import { MusicPlayer } from "../music/MusicPlayer";

@DiscordCommand({
  name: "skip",
  description: "Skip to the next song",
})
export class SkipCommand {
  public async handle({ interaction, voiceChannel }: HandleCommandParams) {
    const response = await respond(interaction).acknowledge("Skipping...");

    const musicPlayer = await MusicPlayer.fromGuild(voiceChannel.guildId);
    musicPlayer.toggleLoop(false);
    musicPlayer.selectNextTrack();
    await musicPlayer.playTrack(true);

    const currentTrack = musicPlayer.playlist.at(0);
    if (currentTrack.isOk()) {
      await response.edit(
        new TrackInfoEmbed(currentTrack.value.info, musicPlayer.playlist, null)
      );
    } else {
      await response.edit(
        new SuccessEmbed().setTitle("No more tracks to play.")
      );
    }
  }
}
