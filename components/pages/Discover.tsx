import { route } from "preact-router";
import { useComputed } from "@preact/signals";

import genres from "@/static/genres.json" assert { type: "json" };
import type { Track } from "@/utils/types.ts";
import { useGenreCharts } from "@/utils/client.ts";
import { useSongQueue } from "@/utils/songQueue.ts";

import SongCard from "@/components/SongCard.tsx";
import Error from "@/components/Error.tsx";
import Loader from "@/components/Loader.tsx";

const [{ title: defaultTitle, value: defaultGenre }] = genres;

interface DiscoverProps {
  readonly genre?: string;
}

export default function Discover({ genre = defaultGenre }: DiscoverProps) {
  const queue = useSongQueue();
  const response = useGenreCharts(genre);
  const tracks = useComputed(() => response.data);

  const onGenreChange = (event: Event) => {
    const { value = undefined } = event.target as HTMLSelectElement;

    if (genres.some((g) => g.value === value)) {
      route(`/discover/${value}`);
    }
  };

  const onSongClick = (song: Track, index: number) => {
    if (tracks.value === undefined) {
      return;
    }

    if (queue.isPlaying && queue.current?.id === song.id) {
      queue.toggle();
      return;
    }

    const songSlice = tracks.value.slice(index);

    queue.listenTo(...songSlice);
  };

  if (response.error !== undefined) {
    return <Error />;
  }

  if (tracks.value === undefined) {
    return <Loader>Loading songs...</Loader>;
  }

  const genreTitle = genres
    .find((g) => g.value === genre)?.title ?? defaultTitle;

  return (
    <article class="discover">
      <section class="discover-genres">
        <h2 class="discover-genres-title">Discover {genreTitle}</h2>
        <select
          title="Discover Genre"
          value={genre}
          name="genre"
          class="discover-genres-select"
          onChange={onGenreChange}
        >
          {genres.map(({ title, value }) => (
            <option key={value} value={value}>{title}</option>
          ))}
        </select>
      </section>

      <ol class="discover-songs">
        {tracks.value.map((track, i) => (
          <SongCard
            key={track.id}
            onClick={() => onSongClick(track, i)}
            {...track}
          />
        ))}
      </ol>
    </article>
  );
}
