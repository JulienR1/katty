import { SlashCommandBuilder } from "@discordjs/builders";
import { IDiscordCommand } from "./types";

type NoSpaceString<S> = S extends `${string} ${string}` ? never : S;
type DiscordCommandOptions<S extends string> = {
  name: NoSpaceString<Lowercase<S>>;
  description: string;
};

type IDiscordCommandHandler = IDiscordCommand["handle"];
type IDiscordCommandConstructor = new () => IDiscordCommand;

const rawCommands = new Set<{
  constructor: IDiscordCommandConstructor;
  options: DiscordCommandOptions<string>;
}>();

const registeredCommands: Record<string, IDiscordCommandHandler> = {};

export function DiscordCommand<S extends string>(
  options: DiscordCommandOptions<S>
) {
  return function (constructor: IDiscordCommandConstructor) {
    rawCommands.add({ constructor, options });
  };
}

export const getSlashCommands = () => {
  const slashCommands: SlashCommandBuilder[] = [];

  for (const { constructor, options } of rawCommands) {
    const command = new constructor();
    registeredCommands[options.name] = command.handle;

    slashCommands.push(
      new SlashCommandBuilder()
        .setName(options.name)
        .setDescription(options.description)
    );
  }

  return slashCommands.map((command) => command.toJSON());
};

export const getCommandHandler = (commandName: string) => {
  return registeredCommands[commandName];
};
