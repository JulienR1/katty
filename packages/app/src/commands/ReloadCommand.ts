import {
  DiscordCommand,
  getSlashCommands,
  HandleCommandParams,
  updateSlashCommands,
} from "discord-command-handler";
import { PermissionFlagsBits } from "discord.js";
import { SuccessEmbed } from "../embeds/SuccessEmbed";
import { respond } from "../embeds/utils/responses";

@DiscordCommand({
  name: "reload",
  description: "Reload a command",
  extra: (builder) =>
    builder.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
})
export class ReloadCommand {
  public async handle({ interaction }: HandleCommandParams) {
    if (!interaction.guildId) {
      return await respond(interaction).refuse("Guild not found");
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

    const response = await respond(interaction).acknowledge(
      `Updating ${commandsToUpdate.length} application (/) command${
        commandsToUpdate.length !== 1 ? "s" : ""
      }`
    );

    await updateSlashCommands(
      commandsToUpdate,
      interaction.guildId ?? "",
      interaction.applicationId,
      process.env.DISCORD_TOKEN ?? ""
    );

    await response.edit(
      new SuccessEmbed().setTitle(
        `Updated ${commandsToUpdate.length} application (/) command${
          commandsToUpdate.length > 1 ? "s" : ""
        }`
      )
    );
  }
}
