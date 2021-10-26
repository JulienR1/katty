import { Awaitable, Client, ClientEvents, Message } from "discord.js";
import { CommandRequest } from "../commands/CommandRequest";
import { CommandHandler } from "../commands/CommandHandler";
import { DiscordEvent } from "./DiscordEvent";
import { UserNotConnectedEmbed } from "../commands/embeds/UserNotConnectedEmbed";
import { InvalidPrefixError } from "../errors/InvalidPrefixError";

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

  async onEvent(message: Message): Promise<Awaitable<void>> {
    if (message.author.bot) {
      return;
    }

    try {
      const request = new CommandRequest(message);
      if (message.member?.voice.channel) {
        CommandHandler.Instance().executeCommand(request);
      } else {
        message.channel.send({ embeds: [new UserNotConnectedEmbed()] });
      }
    } catch (err) {
      if (err instanceof InvalidPrefixError) {
        console.log(err.message);
      } else {
        console.log(err);
      }
    }
  }
}
