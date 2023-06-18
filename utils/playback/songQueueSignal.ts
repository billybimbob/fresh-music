import { batch, type Signal, signal } from "@preact/signals";
import type { ArtistSong, Song, Track } from "@/utils/types.ts";

export interface SongQueueSource {
  readonly current: Signal<Song | null>;
  readonly finished: Signal<readonly Song[]>;
  readonly upcoming: Signal<readonly Song[]>;
  readonly isPlaying: Signal<boolean>;
}

export function createSource(): SongQueueSource {
  return {
    current: signal<Song | null>(null),
    finished: signal<readonly Song[]>([]),
    upcoming: signal<readonly Song[]>([]),
    isPlaying: signal(false),
  };
}
export class SongQueueSignal {
  readonly #source: SongQueueSource;

  constructor(source?: SongQueueSource) {
    this.#source = source ?? createSource();
  }

  get current() {
    return this.#source.current.value;
  }

  get finished() {
    return this.#source.finished.value;
  }

  get upcoming() {
    return this.#source.upcoming.value;
  }

  get isPlaying() {
    return this.#source.isPlaying.value;
  }

  get canPlay() {
    return Boolean(this.#source.current.value?.data);
  }

  get hasPrevious() {
    return this.#source.finished.value.length > 0;
  }

  get hasNext() {
    return this.#source.upcoming.value.length > 0;
  }

  clear() {
    this.#source.upcoming.value = [];
  }

  shuffle() {
    const { upcoming } = this.#source;
    const shuffled = [...upcoming.value];
    const last = shuffled.length - 1;

    for (let i = 0; i < last; ++i) {
      const j = Math.round(Math.random() * (last - i)) + i;
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    upcoming.value = shuffled;
  }

  seekPrevious() {
    const { current, upcoming, finished, isPlaying } = this.#source;

    if (current.value) {
      upcoming.value = [current.value, ...upcoming.value];
    }

    current.value = finished.value.at(-1) ?? null;
    isPlaying.value = isPlaying.value && this.canPlay;

    if (this.hasPrevious) {
      finished.value = finished.value.slice(0, -1);
    }
  }

  seekNext() {
    const { current, finished, upcoming, isPlaying } = this.#source;

    if (current.value) {
      finished.value = [...finished.value, current.value];
    }

    current.value = upcoming.value.at(0) ?? null;
    isPlaying.value = isPlaying.value && this.canPlay;

    if (this.hasNext) {
      upcoming.value = upcoming.value.slice(1);
    }
  }

  toggle() {
    const { isPlaying } = this.#source;

    if (isPlaying.value) {
      isPlaying.value = false;
    } else if (this.canPlay) {
      isPlaying.value = true;
    }
  }

  add(...songs: readonly Song[]) {
    const valid = songs.filter(isValidSong);
    if (valid.length === 0) return;

    const { upcoming, current, isPlaying } = this.#source;
    const added = [...upcoming.value, ...valid];

    if (current.value !== null) {
      upcoming.value = added;
      return;
    }

    batch(() => {
      current.value = added[0];
      upcoming.value = added.slice(1);
      isPlaying.value = true;
    });
  }

  listenTo(...songs: readonly Song[]) {
    const valid = songs.filter(isValidSong);
    if (valid.length === 0) return;

    const { finished, current, upcoming, isPlaying } = this.#source;

    batch(() => {
      finished.value = [];
      current.value = valid[0];
      upcoming.value = valid.slice(1);
      isPlaying.value = true;
    });
  }
}

function isValidSong(song: Song) {
  const hasImage = (song as Track).images?.cover ||
    (song as ArtistSong).artwork?.url;

  return Boolean(hasImage && song.data);
}
