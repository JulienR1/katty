import { CommandVerb } from "../VerbRegistry";
import { ICommandDescription } from "./ICommandDescription";

export interface ICommand {
	getVerb(): CommandVerb;
	execute(content: ICommandDescription): void;
}
