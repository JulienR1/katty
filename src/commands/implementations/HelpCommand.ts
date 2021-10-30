import i18n from "i18n";
import { Command } from "../Command";
import { CommandVerb } from "../VerbRegistry";
import { ICommandDescription } from "../models/ICommandDescription";
import { CommandHandler } from "../CommandHandler";
import { SuccessEmbed } from "../embeds";

export class HelpCommand extends Command {
	constructor() {
		super(CommandVerb.HELP, i18n.__("description.help"));
	}

	public async execute({ channel }: ICommandDescription) {
		const commands = CommandHandler.Instance()
			.getCommands()
			.sort((a, b) => a.getVerb().localeCompare(b.getVerb()));

		const commandHelp = commands.map((command) => `\`${command.getVerb()}\` : ${command.getDescription()}`);
		const embed = new SuccessEmbed().setTitle(i18n.__("help")).setDescription(commandHelp.join("\n"));

		channel.send({ embeds: [embed] });
	}
}
