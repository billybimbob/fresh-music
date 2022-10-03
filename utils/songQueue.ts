import { batch, computed, signal } from "@preact/signals";
import type { Song } from "@/utils/types.ts";

// singleton state intentionally

const current = signal<Song | null>(null);
const finished = signal<readonly Song[]>([]);
const upcoming = signal<readonly Song[]>([]);

const isPlaying = signal(false);
const hasPrevious = computed(() => finished.value.length > 0);
const hasNext = computed(() => upcoming.value.length > 0);

export default {
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
};
