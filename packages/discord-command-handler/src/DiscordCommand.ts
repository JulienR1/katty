import { SlashCommandBuilder } from "@discordjs/builders";
import { Interaction } from "discord.js";
import { HandleCommandParams, IDiscordCommand } from "./types";

type SlashCommandBuilderBase = { toJSON: SlashCommandBuilder["toJSON"] };

type NoSpaceString<S> = S extends `${string} ${string}` ? never : S;
type DiscordCommandOptions<S extends string> = {
  name: NoSpaceString<Lowercase<S>>;
  description: string;
  extra?: (builder: SlashCommandBuilder) => SlashCommandBuilderBase;
};

type IDiscordCommandConstructor = new () => IDiscordCommand;

const rawCommands = new Set<{
  constructor: IDiscordCommandConstructor;
  options: DiscordCommandOptions<string>;
}>();

const registeredCommands: Record<string, IDiscordCommand> = {};

export function DiscordCommand<S extends string>(
  options: DiscordCommandOptions<S>
) {
  return function (constructor: IDiscordCommandConstructor) {
    rawCommands.add({ constructor, options });
  };
}

export const getSlashCommands = () => {
  const slashCommands: SlashCommandBuilderBase[] = [];

  for (const { constructor, options } of rawCommands) {
    const command = new constructor();
    registeredCommands[options.name] = command;

    const commandBuilder = new SlashCommandBuilder()
      .setName(options.name)
      .setDescription(options.description);
    slashCommands.push(options.extra?.(commandBuilder) ?? commandBuilder);
  }

  return slashCommands.map((command) => command.toJSON());
};

export const getCommandHandler = (interaction: Interaction) => {
  if (interaction.isRepliable() && interaction.isChatInputCommand()) {
    return (args: Omit<HandleCommandParams, "interaction">) =>
      registeredCommands[interaction.commandName].handle({
        ...args,
        interaction,
      });
  }

  return undefined;
};

export const getAutocomplete = (interaction: Interaction) => {
  if (interaction.isAutocomplete()) {
    return () =>
      registeredCommands[interaction.commandName].autocomplete?.(interaction);
  }
  return undefined;
};
