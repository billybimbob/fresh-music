import { useContext } from "preact/hooks";
import { useComputed } from "@preact/signals";
import classes from "classnames";

import { type ArtistSong, toSize } from "@/utils/types.ts";
import { SongQueue } from "@/utils/songQueue.ts";
import PlayButton from "@/components/PlayButton.tsx";

interface ArtistSongProps extends ArtistSong {
  readonly spot: number;
  onClick(): void;
}

export default function ArtistSongRow(
  { id, spot, name, data, album, artwork, onClick }: ArtistSongProps,
) {
  const queue = useContext(SongQueue);

  const isActive = useComputed(() =>
    queue.isPlaying && queue.current?.id === id
  );

  const $class = useComputed(() =>
    classes({
      "song-row": true,
      "active": isActive.value,
      "disabled": data === undefined,
    })
  );

  const image = toSize(artwork.url, 125);

  return (
    <li class={$class} onDblClick={data ? onClick : undefined}>
      <div class="body">
        <p class="spot">{spot}</p>
        <img class="img" alt={`${name} Artwork`} src={image} />
        <div class="title">
          <h3 class="name">
            <a href={`/songs/${id}`} title={name}>{name}</a>
          </h3>
          <p class="album" title={album}>{album}</p>
        </div>
      </div>
      {data
        ? (
          <PlayButton
            isActive={isActive}
            title={name}
            onClick={onClick}
          />
        )
        : <div class="play-icon empty" />}
    </li>
  );
}
