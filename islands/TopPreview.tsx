import type { Track } from "@/utils/types.ts";
import { useCharts } from "@/utils/client.ts";
import queue from "@/utils/songQueue.ts";

import SongRow from "@/components/SongRow.tsx";
import Error from "@/components/Error.tsx";
import Loader from "@/components/Loader.tsx";

export default function TopPreview() {
  const { data: tracks, error } = useCharts();

  const topSongs = tracks?.slice(0, 5);

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

  if (topSongs === undefined) {
    return <Loader>Loading Top Songs...</Loader>;
  }

  return (
    <div class="top-preview">
      <div class="top-preview-inner">
        <div class="top-preview-songs">
          <div class="top-preview-songs-header">
            <h2 class="top-preview-songs-title">Top Charts</h2>
            <p class="top-preview-songs-link">
              <a href="/top/songs">See more</a>
            </p>
          </div>
          <div class="top-preview-songs-body">
            {topSongs.map((track, i) => (
              <SongRow
                key={track.id}
                spot={i}
                onClick={() => onSongClick(track, i)}
                {...track}
              />
            ))}
          </div>
        </div>
        <div className="top-preview-artists">
          <div className="top-preview-artists-header">
            <h2 className="top-preview-artists-title">Top Artists</h2>
            <p className="top-preview-artists-link">
              <a href="/top/artists">See more</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
