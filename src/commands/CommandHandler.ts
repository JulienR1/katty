import { ICommand } from "./models/ICommand";
import { CommandVerb } from "./VerbRegistry";
import { CommandRequest } from "./CommandRequest";
import { JoinCommand, KickCommand, NextCommand, PlayCommand, PauseCommand, ResumeCommand, QueueCommand, ClearCommand, LoopCommand, ShuffleCommand, MoveCommand, RemoveCommand } from "./implementations";

export class CommandHandler {
  private static instance: CommandHandler | undefined = undefined;
  private commands: { [key in CommandVerb]?: ICommand } = {};

  private constructor() {
    const unmappedCommands: ICommand[] = [
      new JoinCommand(),
      new KickCommand(),
      new PlayCommand(),
      new NextCommand(),
      new PauseCommand(),
      new ResumeCommand(),
      new QueueCommand(),
      new LoopCommand(),
      new ClearCommand(),
      new ShuffleCommand(),
      new MoveCommand(),
      new RemoveCommand(),
    ];

    unmappedCommands.reduce((obj, command) => {
      obj[command.getVerb()] = command;
      return obj;
    }, this.commands);
  }

  public static Instance(): CommandHandler {
    if (CommandHandler.instance === undefined) {
      CommandHandler.instance = new CommandHandler();
    }
    return CommandHandler.instance;
  }

  public executeCommand(request: CommandRequest) {
    const command = this.commands[request.verb];
    if (command && request.description) {
      try {
        command.execute(request.description);
      } catch (err) {
        console.error(err);
      }
    } else {
      console.error("The specified command does not exist.");
      throw new Error("The specified command does not exist.");
    }
  }
}
