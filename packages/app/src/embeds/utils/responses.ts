import { ChatInputCommandInteraction } from "discord.js";
import { CustomEmbedBuilder } from "../CustomEmbedBuilder";
import { LoadingEmbed } from "../LoadingEmbed";

export const respond = (interaction: ChatInputCommandInteraction) => {
  return {
    acknowledge: async (message: string) => {
      const embed = new LoadingEmbed().setTitle(message);
      await interaction.reply({ embeds: [embed] });

      return {
        edit: (editEmbed: CustomEmbedBuilder) =>
          interaction.editReply({
            embeds: [editEmbed],
            files: editEmbed.files,
          }),
      };
    },
  };
};
