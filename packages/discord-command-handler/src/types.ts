import {
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  VoiceBasedChannel,
} from "discord.js";

export type HandleCommandParams = {
  interaction: ChatInputCommandInteraction;
  voiceChannel: VoiceBasedChannel | null;
};

export interface IDiscordCommand {
  handle(params: HandleCommandParams): void;
  autocomplete?(interaction: AutocompleteInteraction): void;
}
