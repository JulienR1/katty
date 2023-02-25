import { RepliableInteraction } from "discord.js";

type Reason = "bot-not-connected";

export const refuse = (
  interaction: RepliableInteraction,
  reason: Reason
): Promise<unknown> => {
  switch (reason) {
    case "bot-not-connected":
      return interaction.reply("TODO: not connected embed");
    default:
      return interaction.reply("No.");
  }
};
