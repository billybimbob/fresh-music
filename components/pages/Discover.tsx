import { RoutableProps, route } from "preact-router";
import genres from "@/static/genres.json" assert { type: "json" };

import type { Track } from "@/utils/types.ts";
import { useGenreCharts } from "@/utils/client.ts";
import queue from "@/utils/songQueue.ts";

import SongCard from "@/components/SongCard.tsx";
import Error from "@/components/Error.tsx";
import Loader from "@/components/Loader.tsx";

const [{ title: defaultTitle, value: defaultGenre }] = genres;

interface DiscoverProps extends RoutableProps {
  readonly genre?: string;
}

export default function Discover({ genre = defaultGenre }: DiscoverProps) {
  const { data: tracks, error } = useGenreCharts(genre);

  const genreTitle = genres
    .find((g) => g.value === genre)?.title ?? defaultTitle;

  const onGenreChange = (event: Event) => {
    const value = (event.target as HTMLSelectElement)?.value;

    if (genres.some((g) => g.value === value)) {
      route(`/discover/${value}`);
    }
  };

  const onSongClick = (song: Track) => {
    if (tracks === undefined) {
      return;
    }

    if (queue.isPlaying && queue.current?.id === song.id) {
      queue.toggle();
      return;
    }

    const songIndex = tracks.indexOf(song);
    const songSlice = tracks.slice(songIndex);

    queue.listenTo(...songSlice);
  };

  if (error !== undefined) {
    return <Error />;
  }

  if (tracks === undefined) {
    return <Loader>Loading songs...</Loader>;
  }

  return (
    <article class="discover">
      <section class="discover-genres">
        <h2 class="discover-genres-title">Discover {genreTitle}</h2>
        <select
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
        {tracks.map((track) => (
          <SongCard
            key={track.id}
            onClick={() => onSongClick(track)}
            {...track}
          />
        ))}
      </ol>
    </article>
  );
}
