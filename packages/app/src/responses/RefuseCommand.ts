import { ChatInputCommandInteraction } from "discord.js";

type Reason = "bot-not-connected" | "invalid-params";

export const refuse = (
  interaction: ChatInputCommandInteraction,
  reason: Reason
): Promise<unknown> => {
  switch (reason) {
    case "bot-not-connected":
      return interaction.reply("TODO: not connected embed");
    case "invalid-params":
      return interaction.reply("TODO: invalid params");
    default:
      return interaction.reply("No.");
  }
};
