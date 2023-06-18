import { useComputed } from "@preact/signals";

import type { PreloadData, Track } from "@/utils/types.ts";
import { FallbackProvider, useCharts } from "@/utils/client.ts";
import { useSongQueue } from "@/utils/songQueue.ts";

import ArtistCard from "@/components/ArtistCard.tsx";
import SongRow from "@/components/SongRow.tsx";

interface TopPreviewProps {
  initial?: PreloadData;
}

export default function ({ initial = {} }: TopPreviewProps) {
  return (
    <FallbackProvider value={initial}>
      <TopPreview />
    </FallbackProvider>
  );
}

function TopPreview() {
  const queue = useSongQueue();
  const response = useCharts();
  const topSongs = useComputed(() => response.data?.slice(0, 5));

  const onSongClick = (track: Track, index: number) => {
    if (topSongs.value === undefined) {
      return;
    }

    if (queue.isPlaying && queue.current?.id === track.id) {
      queue.toggle();
      return;
    }

    const songSlice = topSongs.value.slice(index);
    queue.listenTo(...songSlice);
  };

  return (
    <aside class="top-preview">
      <section class="songs">
        <header class="header">
          <h2 class="title" title="Top Charts">
            Top Charts
          </h2>
          <p class="link" title="See More Charts">
            <a href="/top/songs">See all</a>
          </p>
        </header>
        <ol class="list">
          {topSongs.value?.map((track, i) => (
            <SongRow
              key={track.id}
              spot={i + 1}
              onClick={() => onSongClick(track, i)}
              {...track}
            />
          ))}
        </ol>
      </section>

      <section class="artists">
        <header class="header">
          <h2 class="title" title="Top Artists">
            Top Artists
          </h2>
          <p class="link" title="See More Artists">
            <a href="/top/artists">See all</a>
          </p>
        </header>
        <ol class="list">
          {topSongs.value?.map((track) => (
            <ArtistCard key={track.id} {...track} />
          ))}
        </ol>
      </section>
    </aside>
  );
}
