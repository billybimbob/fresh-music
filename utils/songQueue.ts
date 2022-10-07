import { batch, useComputed, useSignal } from "@preact/signals";
import { createContext } from "preact";
import { useContext, useMemo } from "preact/hooks";
import type { Song } from "@/utils/types.ts";

export interface SongQueue {
  readonly current: Song | null;
  readonly upcoming: readonly Song[];

  readonly isPlaying: boolean;
  readonly hasPrevious: boolean;
  readonly hasNext: boolean;

  seekPrevious(): void;
  seekNext(): void;
  toggle(): void;

  add(...songs: readonly Song[]): void;
  listenTo(...songs: readonly Song[]): void;

  clear(): void;
  shuffle(): void;
}

export const SongState = createContext<SongQueue>({
  current: null,
  upcoming: [],
  isPlaying: false,
  hasPrevious: false,
  hasNext: false,

  seekPrevious() {},
  seekNext() {},
  toggle() {},

  add(..._songs: readonly Song[]) {},
  listenTo(..._songs: readonly Song[]) {},

  clear() {},
  shuffle() {},
});

export function useSongQueueSource(): SongQueue {
  const current = useSignal<Song | null>(null);
  const finished = useSignal<readonly Song[]>([]);
  const upcoming = useSignal<readonly Song[]>([]);

  const isPlaying = useSignal(false);
  const hasPrevious = useComputed(() => finished.value.length > 0);
  const hasNext = useComputed(() => upcoming.value.length > 0);

  return useMemo(() => ({
    get current() {
      return current.value;
    },

    get upcoming() {
      return upcoming.value;
    },

    get isPlaying() {
      return isPlaying.value;
    },

    get hasPrevious() {
      return hasPrevious.value;
    },

    get hasNext() {
      return hasNext.value;
    },

    seekPrevious() {
      batch(() => {
        if (current.value !== null) {
          upcoming.value = [current.value, ...upcoming.value];
        }

        current.value = finished.value.at(-1) ?? null;

        if (hasPrevious.value) {
          finished.value = finished.value.slice(0, -1);
        }
      });
    },

    seekNext() {
      batch(() => {
        if (current.value !== null) {
          finished.value = [...finished.value, current.value];
        }

        current.value = upcoming.value.at(0) ?? null;

        if (hasNext.value) {
          upcoming.value = upcoming.value.slice(1);
        }
      });
    },

    toggle() {
      isPlaying.value = !isPlaying.value;
    },

    add(...songs: readonly Song[]) {
      if (songs.length === 0) return;

      const added = [...upcoming.value, ...songs];

      if (current.value !== null) {
        upcoming.value = added;
        return;
      }

      batch(() => {
        current.value = added[0];
        upcoming.value = added.slice(1);
        isPlaying.value = true;
      });
    },

    listenTo(...songs: readonly Song[]) {
      if (songs.length === 0) return;

      batch(() => {
        finished.value = [];
        current.value = songs[0];
        upcoming.value = songs.slice(1);
        isPlaying.value = true;
      });
    },

    clear() {
      upcoming.value = [];
    },

    shuffle() {
      const shuffled = [...upcoming.value];
      const last = shuffled.length - 1;

      for (let i = 0; i < last; ++i) {
        const j = Math.round(Math.random() * (last - i)) + i;
        const temp = shuffled[j];
        shuffled[j] = shuffled[i];
        shuffled[i] = temp;
      }

      upcoming.value = shuffled;
    },
  }), [current, finished, upcoming, isPlaying, hasPrevious, hasNext]);
}

export function useSongQueue(): SongQueue {
  return useContext(SongState);
}
