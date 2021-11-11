import { CommandVerb } from "../VerbRegistry";
import { ICommandDescription } from "./ICommandDescription";

export interface ICommand {
	getVerb(): CommandVerb;
	getDescription(): string;
	execute(content: ICommandDescription): void;
}
