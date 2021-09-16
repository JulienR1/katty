import { AudioResource, createAudioResource, demuxProbe } from "@discordjs/voice";
import { raw as ytdl } from "youtube-dl-exec";

export const downloadMusic = async (): Promise<AudioResource | undefined> => {
	const url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
	const process = ytdl(
		url,
		{
			o: "-",
			q: "",
			f: "bestaudio[ext=webm+acodec=opus+asr=48000]/bestaudio",
			r: "100K",
		},
		{ stdio: ["ignore", "pipe", "ignore"] }
	);

	if (!process.stdout) {
		console.error("Could not create process.");
		return undefined;
	}

	const ytStream = process.stdout;

	return new Promise((resolve, reject) => {
		const onError = (error: Error) => {
			if (!process.killed) {
				process.kill();
				ytStream.resume();
				return reject(error);
			}
		};

		process
			.once("spawn", () => {
				demuxProbe(ytStream)
					.then((probe) => {
						return resolve(createAudioResource(probe.stream, { metadata: this, inputType: probe.type }));
					})
					.catch(onError);
			})
			.catch(onError);
	});

	// return createAudioResource(ytStream, { inputType: StreamType.Raw });
};
