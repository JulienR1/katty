import { CacheType, Interaction, VoiceBasedChannel } from "discord.js";

export const getVoiceChannel = (
  interaction: Interaction<CacheType>
): VoiceBasedChannel | null => {
  const userId = interaction.user.id;
  const user = interaction.guild?.members.cache.get(userId);
  return user?.voice.channel ?? null;
};
