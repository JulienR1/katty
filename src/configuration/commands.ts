import { SlashCommandBuilder } from "@discordjs/builders";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";

export const postSlashCommands = async (
  commands: ReturnType<SlashCommandBuilder["toJSON"]>[],
  guildIds: string[],
  applicationId: string
) => {
  const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);
  const promises = guildIds.map((guildId) => {
    rest.put(Routes.applicationGuildCommands(applicationId, guildId), {
      body: commands,
    });
  });

  try {
    console.log(`Started refreshing ${commands.length} application commands.`);
    const data = await Promise.all(promises);
    console.log(
      `Successfully reloaded ${(data as any).length} application (/) commands.`
    );
  } catch (err) {
    console.log("Failed to update commands.");
    console.error(err);
  }
};
