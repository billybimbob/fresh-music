import { useComputed } from "@preact/signals";

import type { Track } from "@/utils/types.ts";
import { useRelatedSongs, useSongDetails } from "@/utils/client.ts";
import { useSongQueue } from "@/utils/songQueue.ts";

import ArtistLink from "@/components/ArtistLink.tsx";
import SongRow from "@/components/SongRow.tsx";
import Error from "@/components/Error.tsx";
import Loader from "@/components/Loader.tsx";

interface SongDetailsProps {
  id: string;
}

export default function SongDetails({ id }: SongDetailsProps) {
  const details = useSongDetails(id);
  const related = useRelatedSongs(id);
  const queue = useSongQueue();

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
      <header class="banner">
        <img
          class="img"
          alt={track.value.name}
          src={track.value.images?.cover}
        />
        <div class="title">
          <h1 class="name">{track.value.name}</h1>
          <p class="artist">
            <ArtistLink {...track.value.artist} />
          </p>
          <p class="genres">
            {track.value.genres?.join(" ") ?? ""}
          </p>
        </div>
      </header>

      <section class="lyrics">
        <h2 class="title">Lyrics</h2>
        <div class="body">
          {track.value.lyrics
            ? track.value.lyrics.map((l) => <p class="text">{l}</p>)
            : <p class="text">No Lyrics Found</p>}
        </div>
      </section>

      <section class="related">
        <h2 class="header">Related Songs</h2>
        <ol class="list">
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
