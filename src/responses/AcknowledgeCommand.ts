import { HandleCommandParams } from "../packages/discord-command-handler/types";

export const acknowledge = async (
  interaction: HandleCommandParams["interaction"]
) => {
  await interaction.reply({ content: "ok", ephemeral: true });
};
