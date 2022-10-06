import { RoutableProps } from "preact-router";
import { useComputed } from "@preact/signals";
import type { Track } from "@/utils/types.ts";
import { useCharts } from "@/utils/client.ts";
import preload from "@/utils/preload.ts";
import queue from "@/utils/songQueue.ts";

import SongCard from "@/components/SongCard.tsx";
import Error from "@/components/Error.tsx";
import Loader from "@/components/Loader.tsx";

export default function TopSongs(_props: RoutableProps) {
  const { data: tracks, error } = useCharts(preload.charts !== undefined);

  const songs = useComputed(() => preload.charts ?? tracks);

  const onSongClick = (track: Track, index: number) => {
    if (songs.value === undefined) {
      return;
    }

    if (queue.isPlaying && queue.current?.id === track.id) {
      queue.toggle();
      return;
    }

    const songSlice = songs.value.slice(index);

    queue.listenTo(...songSlice);
  };

  if (error !== undefined) {
    return <Error />;
  }

  if (songs.value === undefined) {
    return <Loader>Loading Top Songs...</Loader>;
  }

  return (
    <article class="top-songs">
      <h2 class="top-songs-title">Discover Top Songs</h2>
      <ol class="top-songs-list">
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
