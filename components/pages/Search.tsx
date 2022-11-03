import { useContext } from "preact/hooks";
import { useComputed } from "@preact/signals";

import type { Track } from "@/utils/types.ts";
import { useMusicSearch } from "@/utils/client.ts";
import { SongQueue } from "@/utils/songQueue.ts";

import SongCard from "@/components/SongCard.tsx";
import Error from "@/components/Error.tsx";
import Loader from "@/components/Loader.tsx";

interface SearchProps {
  query: string;
}

export default function Search({ query }: SearchProps) {
  const response = useMusicSearch(query);
  const queue = useContext(SongQueue);
  const tracks = useComputed(() => response.data?.tracks);

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

  if (response.error) {
    return <Error />;
  }

  if (tracks.value === undefined) {
    return <Loader>Searching {query}</Loader>;
  }

  return (
    <article class="search-page">
      <h2 class="title">
        Showing results for <span class="query">{query}</span>
      </h2>
      <ol class="results">
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
