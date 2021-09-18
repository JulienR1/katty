import { ICommand } from "./models/ICommand";
import { CommandVerb } from "./VerbRegistry";
import { CommandRequest } from "./CommandRequest";
import { PlayCommand } from "./implementations/PlayCommand";
import { JoinCommand } from "./implementations/JoinCommand";
import { KickCommand } from "./implementations/KickCommand";
import { PauseCommand } from "./implementations/PauseCommand";
import { NextCommand } from "./implementations/NextCommand";
import { ResumeCommand } from "./implementations/ResumeCommand";
import { QueueCommand } from "./implementations/QueueCommand";

export class CommandHandler {
	private static instance: CommandHandler | undefined = undefined;
	private commands: { [key in CommandVerb]?: ICommand } = {};

	private constructor() {
		const unmappedCommands: ICommand[] = [
			new PlayCommand(),
			new JoinCommand(),
			new KickCommand(),
			new PauseCommand(),
			new NextCommand(),
			new ResumeCommand(),
			new QueueCommand(),
		];

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
		if (command && request.description) {
			try {
				command.execute(request.description);
			} catch (err) {
				// TODO: Remove this and actually manage the errors correctly with messages etc.
				console.error(err);
			}
		} else {
			console.error("The specified command does not exist.");
			throw new Error("The specified command does not exist.");
		}
	}
}
