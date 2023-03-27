import { ChatInputCommandInteraction } from "discord.js";

export const acknowledge = async (interaction: ChatInputCommandInteraction) => {
  await interaction.reply({ content: "ok", ephemeral: true });

  return {
    edit: (message: string) => interaction.editReply(message),
  };
};
