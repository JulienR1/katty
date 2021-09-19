import { ICommand } from "./models/ICommand";
import { ICommandDescription } from "./models/ICommandDescription";
import { CommandVerb } from "./VerbRegistry";

export abstract class Command implements ICommand {
	constructor(protected verb: CommandVerb) {}

	public getVerb(): CommandVerb {
		return this.verb;
	}

	abstract execute(description: ICommandDescription): void;
}
