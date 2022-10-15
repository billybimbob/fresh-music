import { type RoutableProps } from "preact-router";
import { useComputed } from "@preact/signals";

import type { Track } from "@/utils/types.ts";
import { useCharts } from "@/utils/client.ts";
import { useSongQueue } from "@/utils/songQueue.ts";

import SongCard from "@/components/SongCard.tsx";
import Error from "@/components/Error.tsx";
import Loader from "@/components/Loader.tsx";

export default function TopSongs(_props: RoutableProps) {
  const response = useCharts();
  const queue = useSongQueue();
  const tracks = useComputed(() => response.data);

  const onSongClick = (track: Track, index: number) => {
    if (tracks.value === undefined) {
      return;
    }

    if (queue.isPlaying && queue.current?.id === track.id) {
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
    return <Loader>Loading Top Songs...</Loader>;
  }

  return (
    <article class="top-songs">
      <h2 class="top-songs-title">Discover Top Songs</h2>
      <ol class="top-songs-list">
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
