import { DiscordCommand, HandleCommandParams } from "discord-command-handler";
import { SuccessEmbed } from "../embeds/SuccessEmbed";
import { TrackInfoEmbed } from "../embeds/TrackInfoEmbed";
import { formatTitle } from "../embeds/utils/formatters";
import { respond } from "../embeds/utils/responses";
import { MusicPlayer } from "../music/MusicPlayer";

@DiscordCommand({
  name: "skip",
  description: "Skip to the next song",
})
export class SkipCommand {
  public async handle({ interaction, voiceChannel }: HandleCommandParams) {
    const musicPlayer = await MusicPlayer.fromGuild(voiceChannel.guildId);
    const trackToSkip = musicPlayer.playlist.at(0);

    if (!trackToSkip.isOk()) {
      return await respond(interaction).refuse("No track to skip.");
    } else {
      const response = await respond(interaction).acknowledge(
        `Skipping "${formatTitle(trackToSkip.value.info.title, 14)}"...`
      );

      musicPlayer.toggleLoop(false);
      musicPlayer.selectNextTrack();
      await musicPlayer.playTrack(true);

      const trackToPlay = musicPlayer.playlist.at(0);
      if (trackToPlay.isOk()) {
        await response.edit(
          new TrackInfoEmbed(trackToPlay.value.info, musicPlayer.playlist, null)
        );
      } else {
        await response.edit(
          new SuccessEmbed().setTitle("No more tracks to play.")
        );
      }
    }
  }
}
