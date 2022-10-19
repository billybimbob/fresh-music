import { useContext } from "preact/hooks";
import { useComputed } from "@preact/signals";

import type { Track } from "@/utils/types.ts";
import { useRelatedSongs, useSongDetails } from "@/utils/client.ts";
import SongQueue from "@/utils/songQueue.ts";

import ArtistLink from "@/components/ArtistLink.tsx";
import SongRow from "@/components/SongRow.tsx";
import Error from "@/components/Error.tsx";
import Loader from "@/components/Loader.tsx";

interface SongDetailsProps {
  readonly id: string;
}

export default function SongDetails({ id }: SongDetailsProps) {
  const details = useSongDetails(id);
  const related = useRelatedSongs(id);
  const queue = useContext(SongQueue);

  const track = useComputed(() => details.data);
  const songs = useComputed(() => related.data);

  const onSongClick = (song: Track, index: number) => {
    if (songs.value === undefined) {
      return;
    }

    if (queue.isPlaying && queue.current?.id === song.id) {
      queue.toggle();
      return;
    }

    const songSlice = songs.value.slice(index);

    queue.listenTo(...songSlice);
  };

  if (details.error || related.error) {
    return <Error />;
  }

  if (track.value === undefined || songs.value === undefined) {
    return <Loader>Searching song details...</Loader>;
  }

  return (
    <article class="song-page">
      <header class="song-details">
        <div class="song-banner">
          <img
            class="song-img"
            alt={track.value.name}
            src={track.value.images?.cover}
          />
          <div class="song-title">
            <h1 class="song-title-name">{track.value.name}</h1>
            <p class="song-title-artist">
              <ArtistLink {...track.value.artist} />
            </p>
            <p class="song-title-genres">
              {track.value.genres?.join(" ") ?? ""}
            </p>
          </div>
        </div>
      </header>

      <section class="song-lyrics">
        <h2 class="song-lyrics-title">Lyrics</h2>
        <div class="song-lyrics-body">
          <p class="song-lyrics-text">
            {track.value.lyrics ?? "No lyrics found"}
          </p>
        </div>
      </section>

      <section class="song-related">
        <h2 class="song-related-header">Related Songs</h2>
        <ol class="song-related-list">
          {songs.value.map((song, i) => (
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
