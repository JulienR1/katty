import { DiscordCommand, HandleCommandParams } from "discord-command-handler";
import { SuccessEmbed } from "../embeds/SuccessEmbed";
import { respond } from "../embeds/utils/responses";
import { MusicPlayer } from "../music/MusicPlayer";
import { TrackFactory } from "../music/TrackFactory";
import { shuffle } from "../utils/shuffle"

const songs = ['Bad Together', 'Bang Bang', 'Be the One', 'Begging', 'Blow Your Mind (Mwah)', 'Boys Will Be Boys', 'Break My Heart', 'Bridge over Troubled Water', 'Can They Hear Us', 'Cold Heart (Pnau remix)', 'Cool', 'Demeanor', 'Do I Wanna Know?', "Don't Start Now", 'Dreams', 'Electricity', 'Fever', 'For Julian', 'Future Nostalgia', 'Garden', 'Genesis', 'Golden Slumbers', 'Good in Bed', 'Hallucinate', 'High', 'High, Wild & Free', 'Homesick', 'Hotter than Hell', "I'd Rather Go Blind", 'IDGAF', "If It Ain't Me", 'If Only', 'In the Room : Tears Dry on Their Own', "I'm Not the Only One", 'Kiss and Make Up', 'Last Dance', 'Levitating', 'Lost in Your Light', 'Love Again', 'Love Is Religion (The Blessed Madonna remix)', 'My Love', 'My My My', 'New Love', 'New Rules', 'No Goodbyes', 'No Lie', 'Not My Problem', 'One Kiss', 'One Dance', 'Physical', 'Potion', 'Pretty Please', 'Prisoner', 'Real Groove (Studio 2054 remix) #', "Rollin' / Did You See", 'Room for 2', 'Running', 'Scared to Be Lonely', 'Sugar (remix) #', 'Swan Song', 'Sweetest Pie', 'That Kind of Woman', 'The Hills', "Thinking 'Bout You", 'Times Like These', 'Un Día (One Day)', 'Want To', "We're Good"];

@DiscordCommand({ name: "babe", description: "All hail babe!" })
export class BabeCommand {
    public async handle({ interaction, voiceChannel }: HandleCommandParams) {
        const response = await respond(interaction).acknowledge("**fangirl noises**")

        const musicPlayer = MusicPlayer.fromGuild(voiceChannel.guildId);
        await musicPlayer.join(voiceChannel);

        const titles = shuffle(songs);
        for (const title of titles) {
            const trackResult = await TrackFactory.fromQuery(`${title} Dua Lipa`);
            if (trackResult.type === "single-track") {
                musicPlayer.playlist.add(trackResult.track);
                musicPlayer.playTrack();
            }
        }

        await response.edit(new SuccessEmbed().setTitle("Babe is in town!"));
    }
}
