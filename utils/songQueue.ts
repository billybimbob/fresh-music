import { createContext } from "preact";
import { batch, computed, signal } from "@preact/signals";
import type { ArtistSong, Song, Track } from "@/utils/types.ts";

export class SongQueueSignal {
  readonly #current = signal<Song | null>(null);
  readonly #finished = signal<readonly Song[]>([]);
  readonly #upcoming = signal<readonly Song[]>([]);

  readonly #isPlaying = signal(false);
  readonly #canPlay = computed(() => this.#current.value?.data !== undefined);

  readonly #hasPrevious = computed(() => this.#finished.value.length > 0);
  readonly #hasNext = computed(() => this.#upcoming.value.length > 0);

  get current() {
    return this.#current.value;
  }

  get finished() {
    return this.#finished.value;
  }

  get upcoming() {
    return this.#upcoming.value;
  }

  get isPlaying() {
    return this.#isPlaying.value;
  }

  get hasPrevious() {
    return this.#hasPrevious.value;
  }

  get hasNext() {
    return this.#hasNext.value;
  }

  seekPrevious() {
    batch(() => {
      if (this.#current.value !== null) {
        this.#upcoming.value = [this.#current.value, ...this.#upcoming.value];
      }

      this.#current.value = this.#finished.value.at(-1) ?? null;
      this.#isPlaying.value = this.#isPlaying.value && this.#canPlay.value;

      if (this.#hasPrevious.value) {
        this.#finished.value = this.#finished.value.slice(0, -1);
      }
    });
  }

  seekNext() {
    batch(() => {
      if (this.#current.value !== null) {
        this.#finished.value = [...this.#finished.value, this.#current.value];
      }

      this.#current.value = this.#upcoming.value.at(0) ?? null;
      this.#isPlaying.value = this.#isPlaying.value && this.#canPlay.value;

      if (this.#hasNext.value) {
        this.#upcoming.value = this.#upcoming.value.slice(1);
      }
    });
  }

  toggle() {
    if (this.#isPlaying.value) {
      this.#isPlaying.value = false;
      return;
    }

    if (this.#canPlay.value) {
      this.#isPlaying.value = true;
    }
  }

  add(...songs: readonly Song[]) {
    const valid = songs.filter(isValidSong);
    if (valid.length === 0) return;

    const added = [...this.#upcoming.value, ...valid];

    if (this.#current.value !== null) {
      this.#upcoming.value = added;
      return;
    }

    batch(() => {
      this.#current.value = added[0];
      this.#upcoming.value = added.slice(1);
      this.#isPlaying.value = true;
    });
  }

  listenTo(...songs: readonly Song[]) {
    const valid = songs.filter(isValidSong);
    if (valid.length === 0) return;

    batch(() => {
      this.#finished.value = [];
      this.#current.value = valid[0];
      this.#upcoming.value = valid.slice(1);
      this.#isPlaying.value = true;
    });
  }

  clear() {
    this.#upcoming.value = [];
  }

  shuffle() {
    const shuffled = [...this.#upcoming.value];
    const last = shuffled.length - 1;

    for (let i = 0; i < last; ++i) {
      const j = Math.round(Math.random() * (last - i)) + i;
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    this.#upcoming.value = shuffled;
  }
}

function isValidSong(song: Song) {
  const hasImage = (song as Track).images?.cover ||
    (song as ArtistSong).artwork?.url;

  return Boolean(hasImage && song.data);
}

export const SongQueue = createContext(new SongQueueSignal());
