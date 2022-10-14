import { RoutableProps } from "preact-router";
import { useComputed } from "@preact/signals";

import { type ArtistSong, toSize } from "@/utils/types.ts";
import { useArtistDetails } from "@/utils/client.ts";
import { useSongQueue } from "@/utils/songQueue.ts";

import Error from "@/components/Error.tsx";
import Loader from "@/components/Loader.tsx";
import ArtistSongRow from "@/components/ArtistSongRow.tsx";

interface ArtistDetailsProps extends RoutableProps {
  readonly id?: string;
}

export default function ArtistDetails({ id = "" }: ArtistDetailsProps) {
  const response = useArtistDetails(id);

  const queue = useSongQueue();

  const artist = useComputed(() => response.data);

  const image = useComputed(() =>
    artist.value === undefined
      ? undefined
      : toSize(artist.value.artwork.url, 500)
  );

  const onSongClick = (song: ArtistSong, index: number) => {
    if (artist.value === undefined) {
      return;
    }

    if (queue.isPlaying && queue.current?.id === song.id) {
      queue.toggle();
      return;
    }

    const songSlice = artist.value.songs.slice(index);

    queue.listenTo(...songSlice);
  };

  if (response.error !== undefined) {
    return <Error />;
  }

  if (artist.value === undefined) {
    return <Loader>Loading artist details...</Loader>;
  }

  return (
    <article class="artist-page">
      <header class="artist-details">
        <div class="artist-banner">
          <img
            class="artist-img"
            alt={`${artist.value.name} Profile`}
            src={image.value}
          />
          <div class="artist-title">
            <h1 class="artist-title-name" title={artist.value.name}>
              {artist.value.name}
            </h1>
            <p class="artist-title-genres">{artist.value.genres.join(" ")}</p>
          </div>
        </div>
      </header>

      <section class="artist-songs">
        <h2 class="artist-songs-header">Related Songs:</h2>
        <ol class="artist-songs-list">
          {artist.value.songs.map((song, i) => (
            <ArtistSongRow
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
