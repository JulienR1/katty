import {
  DiscordCommand,
  getSlashCommands,
  HandleCommandParams,
  updateSlashCommands,
} from "discord-command-handler";
import { PermissionFlagsBits } from "discord.js";
import { acknowledge, refuse } from "../responses";

@DiscordCommand({
  name: "reload",
  description: "Reload a command",
  extra: (builder) =>
    builder.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
})
export class ReloadCommand {
  public async handle({ interaction }: HandleCommandParams) {
    if (!interaction.guildId) {
      await refuse(interaction, "no-guild");
    }

    const commandInput = interaction.options.getString("command");
    const updateEveryCommand =
      commandInput === null ||
      commandInput.length === 0 ||
      commandInput === "all";

    const commands = getSlashCommands();
    const commandsToUpdate = commands.filter(
      (command) => updateEveryCommand || command.name === commandInput
    );

    const editReply = await acknowledge(interaction);
    await editReply.edit(
      `Updating ${commandsToUpdate.length} application (/) command${
        commandsToUpdate.length > 1 ? "s" : ""
      }`
    );

    await updateSlashCommands(
      commandsToUpdate,
      interaction.guildId ?? "",
      interaction.applicationId,
      process.env.DISCORD_TOKEN ?? ""
    );

    await editReply.edit(
      `Updated ${commandsToUpdate.length} application (/) command${
        commandsToUpdate.length > 1 ? "s" : ""
      }`
    );
  }
}
