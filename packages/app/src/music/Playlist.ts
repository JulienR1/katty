import { err, ok, Result } from "../types/Result";
import { Track } from "./Track";

export class Playlist {
  private tracks: Track[] = [];

  public add(...tracks: Track[]): Result<Playlist> {
    this.tracks.push(...tracks);
    return ok(this);
  }

  public move(trackIndex: number, targetIndex: number): Result<Playlist> {
    if (!this.indexInBounds(trackIndex) || !this.indexInBounds(targetIndex)) {
      return err("Index out of bounds.");
    }

    if (trackIndex !== targetIndex) {
      const trackToMove = this.tracks[trackIndex];
      this.tracks.splice(trackIndex, 1);
      this.tracks.splice(targetIndex, 0, trackToMove);
    }

    return ok(this);
  }

  public remove(trackIndex: number): Result<Playlist> {
    if (!this.indexInBounds(trackIndex)) {
      return err("Index out of bounds.");
    }
    this.tracks.splice(trackIndex, 1);
    return ok(this);
  }

  public shuffle(): Result<Playlist> {
    for (let i = 1; i < this.tracks.length - 1; i++) {
      const j = Math.floor(Math.random() * (this.tracks.length - i) + i);
      const tempTrack = this.tracks[i];
      this.tracks[i] = this.tracks[j];
      this.tracks[j] = tempTrack;
    }
    return ok(this);
  }

  public clear(): Result<Playlist> {
    this.tracks = [];
    return ok(this);
  }

  public at(index: number): Result<Track> {
    const track = this.tracks[index]?.clone();
    return track ? ok(track) : err("Track does not exist");
  }

  public getAll(): Track[] {
    return this.tracks.map((track) => track.clone());
  }

  public totalDuration(): number {
    let durationInSec = 0;
    for (const track of this.tracks) {
      durationInSec += track.info.duration;
    }
    return durationInSec;
  }

  private indexInBounds(index: number): boolean {
    return index >= 0 && index < this.tracks.length;
  }
}
