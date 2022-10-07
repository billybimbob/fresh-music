import { RoutableProps } from "preact-router";
import type { Track } from "@/utils/types.ts";
import { useRelatedSongs, useSongDetails } from "@/utils/client.ts";
import { useSongQueue } from "@/utils/songQueue.ts";

import ArtistLink from "@/components/ArtistLink.tsx";
import SongRow from "@/components/SongRow.tsx";
import Error from "@/components/Error.tsx";
import Loader from "@/components/Loader.tsx";

interface SongDetailsProps extends RoutableProps {
  readonly id?: string;
}

export default function SongDetails({ id = "" }: SongDetailsProps) {
  const { data: track, error: songError } = useSongDetails(id);
  const { data: related, error: relatedError } = useRelatedSongs(id);
  const queue = useSongQueue();

  const onSongClick = (song: Track, index: number) => {
    if (related === undefined) {
      return;
    }

    if (queue.isPlaying && queue.current?.id === song.id) {
      queue.toggle();
      return;
    }

    const songSlice = related.slice(index);

    queue.listenTo(...songSlice);
  };

  if (songError || relatedError) {
    return <Error />;
  }

  if (track === undefined || related === undefined) {
    return <Loader>Searching song details...</Loader>;
  }

  return (
    <article class="song-page">
      <section class="song-details">
        <div class="song-header"></div>

        <div class="song-banner">
          <img
            class="song-img"
            alt={`${track.name} Cover`}
            src={track.images?.cover}
          />
          <div class="song-title">
            <h1 class="song-title-name">{track.name}</h1>
            <p class="song-title-artist">
              <ArtistLink {...track.artist} />
            </p>
            <p class="song-title-genres">{track.genres?.join(" ") ?? ""}</p>
          </div>
        </div>

        <div class="song-footer"></div>
      </section>

      <section class="song-lyrics">
        <h2 class="song-lyrics-title">Lyrics:</h2>
        <div class="song-lyrics-body">
          <p class="song-lyrics-text">{track.lyrics ?? "No lyrics found!"}</p>
        </div>
      </section>

      <section class="song-related">
        <h2 class="song-related-header">Related Songs:</h2>
        <ol class="song-related-list">
          {related.map((song, i) => (
            <SongRow
              key={song.id}
              spot={i + 1}
              onClick={() => onSongClick(song, i)}
              {...song}
            />
          ))}
        </ol>
      </section>
    </article>
  );
}
