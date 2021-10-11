
# Katty

Katty will sing for us in our discord channels.

## Description

Katty is a [Discord](https://discord.com/) bot made with [NodeJS](https://nodejs.org/en/) and [TypeScript](https://www.typescriptlang.org/). It is used to play songs from the internet directly in our personnal channel.

### Commands

Commands follow the structure `![VERB] ([ATTRIBUTES])`. The following list explains the current bot functionnalities.
| Command | Verb | Attributes | Description |
|-|-|-|-|
| Join | `join` | — | Summons the bot in the same channel as the user |
| Kick | `kick` `leave` | — | Forces the bot to disconnect |
| Play | `play` `p` | `YouTube url` `search keywords` | Requests a song to be played |
| Pause | `pause` `stop` | — | Pauses the current song |
| Resume | `resume` `continue` `res` | — | Continues the current song |
| Queue | `queue` `q` | — | Displays the current songs in the playlist

### Customizations

The bot can be customized via the [config.json](./src/config.json) file.
