import { CommandVerb } from "./CommandVerb";
import { ICommand } from "./ICommand";

export abstract class Command implements ICommand {
	constructor(private verb: CommandVerb) {}

	public getVerb(): CommandVerb {
		return this.verb;
	}

	abstract execute(keywords: string[]): void;
}
