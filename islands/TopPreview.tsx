import { useContext } from "preact/hooks";
import { useComputed } from "@preact/signals";

import type { PreloadData, Track } from "@/utils/types.ts";
import { FallbackProvider, useCharts } from "@/utils/client.ts";
import SongQueueContext from "@/utils/songQueue.ts";

import ArtistCard from "@/components/ArtistCard.tsx";
import SongRow from "@/components/SongRow.tsx";

interface TopPreviewProps {
  readonly initial?: PreloadData;
}

export default function ({ initial = {} }: TopPreviewProps) {
  return (
    <FallbackProvider value={initial}>
      <TopPreview />
    </FallbackProvider>
  );
}

function TopPreview() {
  const queue = useContext(SongQueueContext);
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
      <section class="top-preview-songs">
        <header class="top-preview-songs-header">
          <h2 class="top-preview-songs-title" title="Top Charts">
            Top Charts
          </h2>
          <p class="top-preview-songs-link">
            <a href="/top/songs" title="See More Charts">See more</a>
          </p>
        </header>
        <ol class="top-preview-songs-list">
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

      <section class="top-preview-artists">
        <header class="top-preview-artists-header">
          <h2 class="top-preview-artists-title" title="Top Artists">
            Top Artists
          </h2>
          <p class="top-preview-artists-link" title="See More Artists">
            <a href="/top/artists">See more</a>
          </p>
        </header>
        <ol class="top-preview-songs-list">
          {topSongs.value?.map((track) => (
            <ArtistCard key={track.id} {...track} />
          ))}
        </ol>
      </section>
    </aside>
  );
}
