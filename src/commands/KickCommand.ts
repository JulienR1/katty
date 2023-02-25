import { PlayerLibrary } from "../music/PlayerLibrary";
import {
  DiscordCommand,
  HandleCommandParams,
} from "../packages/discord-command-handler";
import { acknowledge, refuse } from "../responses";

@DiscordCommand({ name: "kick", description: "Kick Katty" })
export class KickCommand {
  public async handle({ interaction, voiceChannel }: HandleCommandParams) {
    if (!voiceChannel) {
      return await refuse(interaction, "bot-not-connected");
    }

    await acknowledge(interaction);
    await PlayerLibrary.Instance().removeFrom(voiceChannel);
  }
}
