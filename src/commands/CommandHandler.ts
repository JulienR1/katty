import { ICommand } from "./ICommand";
import { CommandRequest } from "./CommandRequest";
import { CommandVerb } from "./CommandVerb";
import { PlayCommand } from "./implementations/PlayCommand";

export class CommandHandler {
	private static instance: CommandHandler | undefined = undefined;
	private commands: { [key in CommandVerb]?: ICommand } = {};

	private constructor() {
		const unmappedCommands: ICommand[] = [new PlayCommand()];

		unmappedCommands.reduce((obj, command) => {
			obj[command.getVerb()] = command;
			return obj;
		}, this.commands);
	}

	public static Instance(): CommandHandler {
		if (CommandHandler.instance === undefined) {
			CommandHandler.instance = new CommandHandler();
		}
		return CommandHandler.instance;
	}

	public executeCommand(request: CommandRequest) {
		const command = this.commands[request.verb];
		if (command) {
			command.execute(request.keywords);
		} else {
			console.error("The specified command does not exist.");
			throw new Error("The specified command does not exist.");
		}
	}
}
