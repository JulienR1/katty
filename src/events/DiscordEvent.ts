import { Awaitable, Client, ClientEvents } from "discord.js";

export abstract class DiscordEvent {
  protected katty: Client | undefined = undefined;
  public abstract eventName: keyof ClientEvents;

  setKatty(katty: Client): void {
    this.katty = katty;
  }

  abstract onEvent(...args: ClientEvents[keyof ClientEvents]): Awaitable<void> | Promise<Awaitable<void>>;
}
