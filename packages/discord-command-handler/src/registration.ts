import { SlashCommandBuilder } from "@discordjs/builders";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";
import { Guild } from "discord.js";

export const updateSlashCommands = async (
  commands: ReturnType<SlashCommandBuilder["toJSON"]>[],
  guildId: Guild["id"],
  applicationId: string,
  discordToken: string
) => {
  if (commands.length === 0) {
    console.log("No application (/) commands to update. Skipping.");
    return;
  }

  const rest = new REST({ version: "10" }).setToken(discordToken);

  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    const data = await rest.put(
      Routes.applicationGuildCommands(applicationId, guildId),
      { body: commands }
    );
    console.log(
      `Successfully refreshed ${(data as any).length} application (/) commands.`
    );
  } catch (err) {
    console.log("Failed to update commands.");
    console.error(err);
  }
};
