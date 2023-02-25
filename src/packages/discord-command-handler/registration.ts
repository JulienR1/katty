import { SlashCommandBuilder } from "@discordjs/builders";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";
import { existsSync, readFileSync, writeFileSync } from "fs";
import path from "path";

export const postSlashCommands = async (
  commands: ReturnType<SlashCommandBuilder["toJSON"]>[],
  guildIds: string[],
  applicationId: string
) => {
  const requiresUpdate = updateRegistry(
    commands.map((command) => command.name)
  );
  if (!requiresUpdate) {
    console.log("No application (/) commands to update. Skipping.");
    return;
  }

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
      `Successfully refreshed ${(data as any).length} application (/) commands.`
    );
  } catch (err) {
    console.log("Failed to update commands.");
    console.error(err);
  }
};

const updateRegistry = (commandNames: string[]) => {
  const filepath = path.join(process.cwd(), "registry.json");
  const registry: Array<string> = existsSync(filepath)
    ? JSON.parse(readFileSync(filepath, "utf-8"))
    : [];

  writeFileSync(filepath, JSON.stringify(commandNames), "utf-8");

  for (const commandName of commandNames) {
    if (!registry.includes(commandName)) {
      return true;
    }
  }
  return false;
};
