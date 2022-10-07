import { RoutableProps } from "preact-router";
import { useComputed } from "@preact/signals";
import classes from "classNames/index.ts";

import type { ArtistSong } from "@/utils/types.ts";
import { toSize } from "@/utils/conversions.ts";
import { useArtistDetails } from "@/utils/client.ts";
import { useSongQueue } from "@/utils/songQueue.ts";

import PlayButton from "@/components/PlayButton.tsx";
import Error from "@/components/Error.tsx";
import Loader from "@/components/Loader.tsx";

interface ArtistDetailsProps extends RoutableProps {
  readonly id?: string;
}

export default function ArtistDetails({ id = "" }: ArtistDetailsProps) {
  const queue = useSongQueue();

  const { data: artist, error } = useArtistDetails(id);

  const image = useComputed(() =>
    artist === undefined ? undefined : toSize(artist.artwork.url, 500)
  );

  const onSongClick = (song: ArtistSong, index: number) => {
    if (artist === undefined) {
      return;
    }

    if (queue.isPlaying && queue.current?.id === song.id) {
      queue.toggle();
      return;
    }

    const songSlice = artist.songs.slice(index);

    queue.listenTo(...songSlice);
  };

  if (error !== undefined) {
    return <Error />;
  }

  if (artist === undefined) {
    return <Loader>Loading artist details...</Loader>;
  }

  return (
    <article class="artist-page">
      <section class="artist-details">
        <div class="artist-header"></div>

        <div class="artist-banner">
          <img
            class="artist-img"
            alt={`${artist.name} Profile`}
            src={image.value}
          />
          <div class="artist-title">
            <h1 class="artist-title-name">{artist.name}</h1>
            <p class="artist-title-genres">{artist.genres.join(" ")}</p>
          </div>
        </div>

        <div class="artist-footer"></div>
      </section>

      <section class="artist-songs">
        <h2 class="artist-songs-header">Related Songs:</h2>
        <ol class="artist-songs-list">
          {artist.songs.map((song, i) => (
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

interface ArtistSongProps extends ArtistSong {
  readonly spot: number;
  onClick(): void;
}

function ArtistSongRow(
  { id, spot, name, album, artwork, onClick }: ArtistSongProps,
) {
  const queue = useSongQueue();

  const isActive = useComputed(() => queue.current?.id === id);

  const item = useComputed(() =>
    classes({
      "artist-song-item": true,
      "artist-song-active": isActive.value,
    })
  );

  const image = toSize(artwork.url, 125);

  return (
    <li class={item.value}>
      <h3 class="artist-song-spot">{spot}</h3>
      <div class="artist-song-body">
        <img class="artist-song-img" alt={`${name} Artwork`} src={image} />
        <div class="artist-song-title">
          <a href={`/songs/${id}`}>
            <p class="artist-song-name">{name}</p>
          </a>
          <p class="artist-song-album">{album}</p>
        </div>
      </div>
      <PlayButton isActive={isActive.value} onClick={onClick} />
    </li>
  );
}
