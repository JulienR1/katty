import { Awaited, Client, ClientEvents, Message } from "discord.js";
import { CommandRequest } from "../commands/CommandRequest";
import { CommandHandler } from "../commands/CommandHandler";
import { DiscordEvent } from "./DiscordEvent";

export class MessageEvent extends DiscordEvent {
	public eventName: keyof ClientEvents;

	constructor() {
		super();
		this.eventName = "messageCreate";
	}

	setKatty(katty: Client) {
		super.setKatty(katty);
		katty.on<string>(this.eventName, async (message: Message) => this.onEvent(message));
	}

	async onEvent(message: Message): Promise<Awaited<void>> {
		if (message.author.bot) {
			return;
		}

		try {
			const request = new CommandRequest(message);
			CommandHandler.Instance().executeCommand(request);
		} catch (err) {
			console.log(err);
		}
	}
}
