import {
  CacheType,
  Interaction,
  InteractionResponseFields,
  VoiceBasedChannel,
} from "discord.js";

type CommandInteraction = Interaction<CacheType> &
  Pick<InteractionResponseFields<CacheType>, "reply">;

export type HandleCommandParams = {
  interaction: CommandInteraction;
  voiceChannel: VoiceBasedChannel | null;
};

export interface IDiscordCommand {
  handle(params: HandleCommandParams): void;
}
