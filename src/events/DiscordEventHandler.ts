import { Client } from "discord.js";
import { DiscordEvent } from "./DiscordEvent";
import { MessageEvent } from "./MessageEvent";
import { ReadyEvent } from "./ReadyEvent";

const commands: DiscordEvent[] = [new ReadyEvent(), new MessageEvent()];

export const bindCommands = (katty: Client) => {
	commands.forEach((command) => {
		command.setKatty(katty);
	});
};
