import { RoutableProps } from "preact-router";
import { useComputed } from "@preact/signals";
import classes from "classNames/index.ts";

import type { ArtistSong } from "@/utils/types.ts";
import { toSize } from "@/utils/conversions.ts";
import { useArtistDetails } from "@/utils/client.ts";
import queue from "@/utils/songQueue.ts";

import PlayButton from "@/components/PlayButton.tsx";
import Error from "@/components/Error.tsx";
import Loader from "@/components/Loader.tsx";

interface ArtistDetailsProps extends RoutableProps {
  readonly id?: string;
}

export default function ArtistDetails({ id = "" }: ArtistDetailsProps) {
  const { data: artist, error } = useArtistDetails(id);

  const image = artist !== undefined
    ? toSize(artist.artwork.url, 500)
    : undefined;

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
    <div class="artist-page">
      <div class="artist-details">
        <div class="artist-header"></div>

        <div class="artist-banner">
          <img class="artist-img" alt={`${artist.name} Profile`} src={image} />
          <div class="artist-title">
            <h1 class="artist-title-name">{artist.name}</h1>
            <p class="artist-title-genres">{artist.genres.join(" ")}</p>
          </div>
        </div>

        <div class="artist-footer"></div>
      </div>

      <div class="artist-songs">
        <h2 class="artist-songs-header">Related Songs:</h2>

        <ol class="artist-songs-list">
          {artist.songs.map((song, i) => (
            <ArtistSongItem
              key={song.id}
              spot={i + 1}
              onClick={() => onSongClick(song, i)}
              {...song}
            />
          ))}
        </ol>
      </div>
    </div>
  );
}

interface ArtistSongProps extends ArtistSong {
  readonly spot: number;
  onClick(): void;
}

function ArtistSongItem(
  { id, spot, name, album, artwork, onClick }: ArtistSongProps,
) {
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
