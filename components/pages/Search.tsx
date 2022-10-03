import { RoutableProps } from "preact-router";

import type { Track } from "@/utils/types.ts";
import { useMusicSearch } from "@/utils/client.ts";
import queue from "@/utils/songQueue.ts";

import SongCard from "@/components/SongCard.tsx";
import Error from "@/components/Error.tsx";
import Loader from "@/components/Loader.tsx";

interface SearchProps extends RoutableProps {
  readonly query?: string;
}

export default function Search({ query = "" }: SearchProps) {
  const response = useMusicSearch(query);
  const tracks = response.data?.tracks;

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

  if (response.error !== undefined) {
    return <Error />;
  }

  if (tracks === undefined) {
    return <Loader>Searching {query}</Loader>;
  }

  return (
    <div class="search">
      <h2 class="search-title">
        Showing results for <span class="search-query">{query}</span>
      </h2>
      <div class="search-songs">
        {tracks.map((track) => (
          <SongCard
            key={track.id}
            onClick={() => onSongClick(track)}
            {...track}
          />
        ))}
      </div>
    </div>
  );
}
