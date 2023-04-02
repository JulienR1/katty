import { DiscordCommand, HandleCommandParams } from "discord-command-handler";
import { SuccessEmbed } from "../embeds/SuccessEmbed";
import { respond } from "../embeds/utils/responses";
import { MusicPlayer } from "../music/MusicPlayer";

@DiscordCommand({ name: "pause", description: "Stop playing the current song" })
export class PauseCommand {
  public async handle({ interaction, voiceChannel }: HandleCommandParams) {
    const response = await respond(interaction).acknowledge(
      "Toggling pause..."
    );

    const paused = await MusicPlayer.fromGuild(
      voiceChannel.guildId
    ).togglePause();

    await response.edit(
      new SuccessEmbed().setTitle(
        paused ? ":pause_button: Paused" : ":arrow_forward: Unpaused"
      )
    );
  }
}
