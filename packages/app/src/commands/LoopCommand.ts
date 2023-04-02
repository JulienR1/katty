import { DiscordCommand, HandleCommandParams } from "discord-command-handler";
import { SuccessEmbed } from "../embeds/SuccessEmbed";
import { respond } from "../embeds/utils/responses";
import { MusicPlayer } from "../music/MusicPlayer";

@DiscordCommand({
  name: "loop",
  description: "Replay the current song in a loop",
})
export class LoopCommand {
  public async handle({ interaction, voiceChannel }: HandleCommandParams) {
    const response = await respond(interaction).acknowledge("Toggling loop...");

    const looping = await MusicPlayer.fromGuild(
      voiceChannel.guildId
    ).toggleLoop();

    await response.edit(
      new SuccessEmbed().setTitle(
        looping
          ? ":loop: | Looping enabled"
          : ":arrow_forward: | Looping disabled"
      )
    );
  }
}
