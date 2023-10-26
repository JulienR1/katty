import { ChatInputCommandInteraction } from "discord.js";
import { CustomEmbedBuilder } from "../CustomEmbedBuilder";
import { ErrorEmbed } from "../ErrorEmbed";
import { LoadingEmbed } from "../LoadingEmbed";

export const respond = (interaction: ChatInputCommandInteraction) => {
  return {
    acknowledge: async (message: string, { hide } = { hide: false }) => {
      const embed = new LoadingEmbed().setTitle(message);
      const sentMessage = await interaction.reply({
        embeds: [embed],
        ephemeral: hide,
      });

      return {
        message: sentMessage,
        edit: (editEmbed: CustomEmbedBuilder) =>
          interaction.editReply({
            embeds: [editEmbed],
            files: editEmbed.files,
            components: editEmbed.components,
          }),
      };
    },
    refuse: async (message: string, { hide } = { hide: false }) => {
      const embed = new ErrorEmbed().setTitle(message);
      await interaction.reply({ embeds: [embed], ephemeral: hide });
    },
  };
};
