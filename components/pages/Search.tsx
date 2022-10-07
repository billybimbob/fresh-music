import { RoutableProps } from "preact-router";
import { useComputed } from "@preact/signals";

import type { Track } from "@/utils/types.ts";
import { useMusicSearch } from "@/utils/client.ts";
import { useSongQueue } from "@/utils/songQueue.ts";

import SongCard from "@/components/SongCard.tsx";
import Error from "@/components/Error.tsx";
import Loader from "@/components/Loader.tsx";

interface SearchProps extends RoutableProps {
  readonly query?: string;
}

export default function Search({ query = "" }: SearchProps) {
  const queue = useSongQueue();

  const { data: result, error } = useMusicSearch(query);

  const tracks = useComputed(() => result?.tracks);

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

  if (error !== undefined) {
    return <Error />;
  }

  if (tracks.value === undefined) {
    return <Loader>Searching {query}</Loader>;
  }

  return (
    <article class="search">
      <h2 class="search-title">
        Showing results for <span class="search-query">{query}</span>
      </h2>
      <ol class="search-songs">
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
