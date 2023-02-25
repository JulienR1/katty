import { BotNotConnectedEmbed } from "../commands/embeds";
import { HandleCommandParams } from "../packages/discord-command-handler/types";

type Reason = "bot-not-connected";

export const refuse = (
  interaction: HandleCommandParams["interaction"],
  reason: Reason
): Promise<void> => {
  switch (reason) {
    case "bot-not-connected":
      return interaction.reply({ embeds: [new BotNotConnectedEmbed()] });
    default:
      return interaction.reply("No.");
  }
};
