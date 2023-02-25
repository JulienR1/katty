import { PlayerLibrary } from "../music/PlayerLibrary";
import {
  DiscordCommand,
  HandleCommandParams,
} from "../packages/discord-command-handler";
import { acknowledge, refuse } from "../responses";

@DiscordCommand({ name: "join", description: "Summon Katty" })
export class JoinCommand {
  public async handle({ interaction, voiceChannel }: HandleCommandParams) {
    if (!voiceChannel) {
      return await refuse(interaction, "bot-not-connected");
    }

    await acknowledge(interaction);
    await PlayerLibrary.Instance().addTo(voiceChannel, () =>
      console.log("TODO: on quit notification")
    );
  }
}
