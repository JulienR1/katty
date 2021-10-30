import { ICommand } from "./models/ICommand";
import { ICommandDescription } from "./models/ICommandDescription";
import { CommandVerb } from "./VerbRegistry";

export abstract class Command implements ICommand {
	constructor(protected verb: CommandVerb, protected description: string) {}

	public getVerb(): CommandVerb {
		return this.verb;
	}

	public getDescription(): string {
		return this.description;
	}

	abstract execute(description: ICommandDescription): void;
}
