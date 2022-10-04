import { RoutableProps } from "preact-router";
import { useComputed } from "@preact/signals";
import classes from "classNames/index.ts";

import type { Track } from "@/utils/types.ts";
import { useRelatedSongs, useSongDetails } from "@/utils/client.ts";
import queue from "@/utils/songQueue.ts";

import PlayButton from "@/components/PlayButton.tsx";
import Error from "@/components/Error.tsx";
import Loader from "@/components/Loader.tsx";

interface SongDetailsProps extends RoutableProps {
  readonly id?: string;
}

export default function SongDetails({ id = "" }: SongDetailsProps) {
  const { data: track, error: songError } = useSongDetails(id);
  const { data: related, error: relatedError } = useRelatedSongs(id);

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
    <div class="song-page">
      <div class="song-details">
        <div class="song-header"></div>

        <div class="song-banner">
          <img
            class="song-img"
            alt={`${track.name} Cover`}
            src={track.images.cover}
          />
          <div class="song-title">
            <h1 class="song-title-name">{track.name}</h1>
            <p class="song-title-artist">{track.artist}</p>
            <p class="song-title-genres">{track.genres.join(" ")}</p>
          </div>
        </div>

        <div class="song-footer"></div>
      </div>

      <div class="song-lyrics">
        <h2 class="song-lyrics-title">Lyrics:</h2>
        <div class="song-lyrics-body">
          <p class="song-lyrics-text">{track.lyrics ?? "No lyrics found!"}</p>
        </div>
      </div>

      <div class="song-related">
        <h2 class="song-related-header">Related Songs:</h2>

        <ol class="song-related-list">
          {related.map((song, i) => (
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

interface RelatedSongProps extends Track {
  readonly spot: number;
  onClick(): void;
}

function ArtistSongItem(
  { id, spot, name, artist, images, onClick }: RelatedSongProps,
) {
  const isActive = useComputed(() => queue.current?.id === id);

  const item = useComputed(() =>
    classes({
      "song-related-item": true,
      "song-related-active": isActive.value,
    })
  );

  return (
    <li class={item.value}>
      <h3 class="song-related-spot">{spot}</h3>
      <div class="song-related-body">
        <img
          class="song-related-img"
          alt={`${name} Artwork`}
          src={images.cover}
        />
        <div class="song-related-title">
          <a href={`/songs/${id}`}>
            <p class="song-related-name">{name}</p>
          </a>
          <p class="song-related-artist">{artist}</p>
        </div>
      </div>
      <PlayButton isActive={isActive.value} onClick={onClick} />
    </li>
  );
}
