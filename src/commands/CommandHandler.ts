import { Command } from "./Command";

export class CommandHandler {
	private static instance: CommandHandler | undefined = undefined;

	private constructor() {}

	public static Instance(): CommandHandler {
		if (CommandHandler.instance === undefined) {
			CommandHandler.instance = new CommandHandler();
		}
		return CommandHandler.instance;
	}

	public executeCommand(command: Command) {
		console.log("executing command: ", command);
	}
}
