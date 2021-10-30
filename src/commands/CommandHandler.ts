import { ICommand } from "./models/ICommand";
import { CommandVerb } from "./VerbRegistry";
import { CommandRequest } from "./CommandRequest";
import * as allCommands from "./implementations";

export class CommandHandler {
	private static instance: CommandHandler | undefined = undefined;
	private commands: { [key in CommandVerb]?: ICommand } = {};

	private constructor() {
		Object.values(allCommands).reduce((obj, commandObject) => {
			const command = new commandObject();
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
		if (command && request.description) {
			try {
				command.execute(request.description);
			} catch (err) {
				console.error(err);
			}
		} else {
			console.error("The specified command does not exist.");
			throw new Error("The specified command does not exist.");
		}
	}

	public getCommands(): ICommand[] {
		return Object.values(this.commands);
	}
}
