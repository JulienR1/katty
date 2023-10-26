import {
  GuildMember,
  Message,
  MessageEditOptions,
  MessagePayload,
  MessageReplyOptions,
} from "discord.js";

export class MockInteraction {
  public guildId: string |null= null 
  private repliedMessage: Message<boolean> | null;

  public options = {
    getString: () => this.content,
  };

  constructor(
    public commandName: string,
    public member: GuildMember | null,
    private content: string,
    private message: Message<boolean>
  ) {
    this.repliedMessage = null;
    this.guildId = member?.guild.id ?? null
  }

  public async reply(params: string | MessagePayload | MessageReplyOptions) {
    this.repliedMessage = await this.message.reply(params);
    return this.repliedMessage;
  }

  public async editReply(params: string | MessagePayload | MessageEditOptions) {
    return this.repliedMessage!.edit(params);
  }

  public isButton() {
    return false;
  }

  public isRepliable() {
    return true;
  }

  public isChatInputCommand() {
    return true;
  }

  public isAutocomplete() {
    return false;
  }

}
