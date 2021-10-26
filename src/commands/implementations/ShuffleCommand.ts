import { MessageEmbed, VoiceChannel } from "discord.js";
import { PlayerLibrary } from "../../music/PlayerLibrary";
import { Command } from "../Command";
import { BotNotConnectedEmbed, ErrorEmbed, SuccessEmbed } from "../embeds";
import { ICommandDescription } from "../models/ICommandDescription";
import { CommandVerb } from "../VerbRegistry";
import i18n from "i18n";

export class ShuffleCommand extends Command {
  constructor() {
    super(CommandVerb.SHUFFLE);
  }

  public execute({ member, channel }: ICommandDescription): void {
    const musicPlayer = PlayerLibrary.Instance().getFrom(member?.voice.channel as VoiceChannel);
    if (!musicPlayer) {
      channel.send({ embeds: [new BotNotConnectedEmbed()] });
      return;
    }

    let embedToSend = new MessageEmbed();
    try {
      musicPlayer.shuffle();
      embedToSend = this.successEmbed();
    } catch (err) {
      embedToSend = this.errorEmbed();
      console.log(err);
    } finally {
      channel.send({ embeds: [embedToSend] });
    }
  }

  private successEmbed = () => new SuccessEmbed().setTitle(i18n.__("shuffle"));

  private errorEmbed = () => new ErrorEmbed();
}
