import { beforeEach, describe, expect, it } from "vitest";
import { Playlist } from "../music/Playlist";
import { Track } from "../music/Track";

const mockTrack = (title: string) => {
  const track = { info: { title }, clone: () => {} };
  track.clone = () => track;
  return track as Track;
};

const tracks = [
  mockTrack("track one"),
  mockTrack("track two"),
  mockTrack("track three"),
];

describe("Playlist", () => {
  let playlist: Playlist;

  beforeEach(() => {
    playlist = new Playlist();
    playlist.add(...tracks);
  });

  describe("move", () => {
    it("should move a single track without changing the order", () => {
      const result = playlist.move(2, 1);

      expect(result.isOk()).toBeTruthy();
      expect(playlist.getAll()).toEqual(
        expect.arrayContaining([tracks[0], tracks[2], tracks[1]])
      );
    });

    it("should not move a track to its place", () => {
      const result = playlist.move(1, 1);

      expect(result.isOk()).toBeTruthy();
      expect(playlist.getAll()).toEqual(tracks);
    });

    it("should not accept invalid indices", () => {
      const result1 = playlist.move(-1, 0);
      const result2 = playlist.move(4, 1);

      expect(result1.isOk()).toBeFalsy();
      expect(result2.isOk()).toBeFalsy();
    });
  });

  describe("remove", () => {
    it("should remove the track from the playlist", () => {
      const result = playlist.remove(0);

      expect(result.isOk()).toBeTruthy();
      expect(playlist.getAll().length).toBe(tracks.length - 1);
      const firstTrack = playlist.at(0);
      if (firstTrack.isOk()) {
        expect(firstTrack.value).toEqual(tracks[1]);
      }
    });

    it("should not remove a track at an invalid index", () => {
      const result1 = playlist.remove(-1);
      const result2 = playlist.remove(4);

      expect(result1.isOk()).toBeFalsy();
      expect(result2.isOk()).toBeFalsy();
    });
  });

  describe("clear", () => {
    it("should remove every track", () => {
      const result = playlist.clear();

      expect(result.isOk()).toBeTruthy();
      expect(playlist.getAll().length).toBe(0);
    });
  });

  describe("shuffle", () => {
    it("should not affect the first track of the playlist", () => {
      for (let i = 0; i < 10; i++) {
        playlist.shuffle();

        const track = playlist.at(0);
        expect(track.isOk()).toBeTruthy();
        if (track.isOk()) {
          expect(track.value).toEqual(tracks[0]);
        }
      }
    });
  });
});
