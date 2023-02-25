import { RepliableInteraction } from "discord.js";

export const acknowledge = async (interaction: RepliableInteraction) => {
  await interaction.reply({ content: "ok", ephemeral: true });
};
