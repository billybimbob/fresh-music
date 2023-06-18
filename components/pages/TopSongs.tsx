import { useContext } from "preact/hooks";
import { useComputed } from "@preact/signals";

import type { Track } from "@/utils/types.ts";
import { useCharts } from "@/utils/client.ts";
import { SongQueue } from "@/utils/songQueue.ts";

import SongCard from "@/components/SongCard.tsx";
import Error from "@/components/Error.tsx";
import Loader from "@/components/Loader.tsx";

export default function TopSongs() {
  const response = useCharts();
  const queue = useContext(SongQueue);
  const tracks = useComputed(() => response.data);

  const onSongClick = (track: Track, index: number) => {
    console.log("clicked song", track.name);
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

  if (response.error) {
    return <Error />;
  }

  if (tracks.value === undefined) {
    return <Loader>Loading Top Songs...</Loader>;
  }

  return (
    <article class="top-songs">
      <h2 class="title">Discover Top Songs</h2>
      <ol class="list">
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
