import { Track } from "./Track";

export interface ITrackFactory {
	from(arg: string): Promise<ITrack>;
}
