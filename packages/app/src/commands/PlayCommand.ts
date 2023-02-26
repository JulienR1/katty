import { DiscordCommand, HandleCommandParams } from "discord-command-handler";
import { acknowledge, refuse } from "../responses";

@DiscordCommand({ name: "play", description: "Request a song to play" })
export class PlayCommand {
  public async handle({ interaction, voiceChannel }: HandleCommandParams) {
    if (!voiceChannel) {
      return await refuse(interaction, "bot-not-connected");
    }

    const editReply = await acknowledge(interaction);
  }
}
