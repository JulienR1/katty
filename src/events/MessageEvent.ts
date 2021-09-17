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

	async onEvent({ member, content, author }: Message): Promise<Awaited<void>> {
		if (author.bot) {
			return;
		}

		try {
			const request = new CommandRequest(member, content);
			CommandHandler.Instance().executeCommand(request);
		} catch (err) {}
	}
}
