import { useComputed } from "@preact/signals";
import type { Track } from "@/utils/types.ts";
import { useCharts } from "@/utils/client.ts";
import { usePreload } from "@/utils/preload.ts";
import { useSongQueue } from "@/utils/songQueue.ts";

import ArtistCard from "@/components/ArtistCard.tsx";
import SongRow from "@/components/SongRow.tsx";

export default function TopPreview() {
  const preload = usePreload();
  const queue = useSongQueue();

  const { data: tracks } = useCharts(preload.charts !== undefined);

  const songs = useComputed(() => preload.charts ?? tracks);
  const topSongs = useComputed(() => songs.value?.slice(0, 5));

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

  return (
    <article class="top-preview">
      <div class="top-preview-inner">
        <section class="top-preview-songs">
          <header class="top-preview-songs-header">
            <h2 class="top-preview-songs-title">Top Charts</h2>
            <p class="top-preview-songs-link">
              <a href="/top/songs">See more</a>
            </p>
          </header>
          <ol class="top-preview-songs-list">
            {topSongs.value?.map((track, i) => (
              <SongRow
                key={track.id}
                spot={i}
                onClick={() => onSongClick(track, i)}
                {...track}
              />
            ))}
          </ol>
        </section>
        <section class="top-preview-artists">
          <header class="top-preview-artists-header">
            <h2 class="top-preview-artists-title">Top Artists</h2>
            <p class="top-preview-artists-link">
              <a href="/top/artists">See more</a>
            </p>
          </header>
          <ol class="top-preview-songs-list">
            {topSongs.value?.map((track) => (
              <ArtistCard key={track.id} {...track} />
            ))}
          </ol>
        </section>
      </div>
    </article>
  );
}
