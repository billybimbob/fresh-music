import { RoutableProps } from "preact-router";
import type { Track } from "@/utils/types.ts";
import { useCharts } from "@/utils/client.ts";
import queue from "@/utils/songQueue.ts";

import SongCard from "@/components/SongCard.tsx";
import Error from "@/components/Error.tsx";
import Loader from "@/components/Loader.tsx";

export default function TopSongs(_props: RoutableProps) {
  const { data: tracks, error } = useCharts();

  const onSongClick = (track: Track, index: number) => {
    if (tracks === undefined) {
      return;
    }

    if (queue.isPlaying && queue.current?.id === track.id) {
      queue.toggle();
      return;
    }

    const songSlice = tracks.slice(index);

    queue.listenTo(...songSlice);
  };

  if (error !== undefined) {
    return <Error />;
  }

  if (tracks === undefined) {
    return <Loader>Loading Top Songs...</Loader>;
  }

  return (
    <div class="top-songs">
      <h2 class="top-songs-title">Discover Top Songs</h2>
      <ol class="top-songs-list">
        {tracks.map((track, i) => (
          <SongCard
            key={track.id}
            onClick={() => onSongClick(track, i)}
            {...track}
          />
        ))}
      </ol>
    </div>
  );
}
