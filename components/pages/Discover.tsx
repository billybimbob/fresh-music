import { useComputed } from "@preact/signals";
import { RoutableProps, route } from "preact-router";
import genres from "@/static/genres.json" assert { type: "json" };

import type { Track } from "@/utils/types.ts";
import { useGenreCharts } from "@/utils/client.ts";
import { usePreload } from "@/utils/preload.ts";
import { useSongQueue } from "@/utils/songQueue.ts";

import SongCard from "@/components/SongCard.tsx";
import Error from "@/components/Error.tsx";
import Loader from "@/components/Loader.tsx";

const [{ title: defaultTitle, value: defaultGenre }] = genres;

interface DiscoverProps extends RoutableProps {
  readonly genre?: string;
}

export default function Discover({ genre = defaultGenre }: DiscoverProps) {
  const preload = usePreload();
  const queue = useSongQueue();

  const response = useGenreCharts(genre, preload.genreCharts !== undefined);
  const songs = useComputed(() => preload.genreCharts ?? response.data);

  const genreTitle = genres
    .find((g) => g.value === genre)?.title ?? defaultTitle;

  const onGenreChange = (event: Event) => {
    const { value = undefined } = event.target as HTMLSelectElement;

    if (genres.some((g) => g.value === value)) {
      route(`/discover/${value}`);
    }
  };

  const onSongClick = (song: Track, index: number) => {
    if (songs.value === undefined) {
      return;
    }

    if (queue.isPlaying && queue.current?.id === song.id) {
      queue.toggle();
      return;
    }

    const songSlice = songs.value.slice(index);

    queue.listenTo(...songSlice);
  };

  if (response.error !== undefined) {
    return <Error />;
  }

  if (songs.value === undefined) {
    return <Loader>Loading songs...</Loader>;
  }

  return (
    <article class="discover">
      <section class="discover-genres">
        <h2 class="discover-genres-title">Discover {genreTitle}</h2>
        <select
          title="Discover Genre"
          value={genre}
          name="genre"
          class="discover-genres-options"
          onChange={onGenreChange}
        >
          {genres.map(({ title, value }) => (
            <option key={value} value={value}>{title}</option>
          ))}
        </select>
      </section>

      <ol class="discover-songs">
        {songs.value.map((track, i) => (
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
