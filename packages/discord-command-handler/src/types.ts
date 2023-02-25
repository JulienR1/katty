import { RepliableInteraction, VoiceBasedChannel } from "discord.js";

export type HandleCommandParams = {
  interaction: RepliableInteraction;
  voiceChannel: VoiceBasedChannel | null;
};

export interface IDiscordCommand {
  handle(params: HandleCommandParams): void;
}
