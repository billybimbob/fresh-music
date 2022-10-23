import { useContext } from "preact/hooks";
import { useComputed } from "@preact/signals";
import classes from "classnames";

import type { Track } from "@/utils/types.ts";
import SongQueue from "@/utils/songQueue.ts";

import ArtistLink from "@/components/ArtistLink.tsx";
import PlayButton from "@/components/PlayButton.tsx";

interface SongRowProps extends Track {
  readonly spot: number;
  onClick(): void;
}

export default function SongRow(
  { id, spot, name, artist, data, images, onClick }: SongRowProps,
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

  return (
    <li class={$class} onDblClick={data ? onClick : undefined}>
      <div class="song-row-body">
        <p class="song-row-spot">{spot}</p>
        <img class="song-row-img" alt={`${name} Cover`} src={images?.cover} />
        <div class="song-row-title">
          <h3 class="song-row-name">
            <a href={`/songs/${id}`} title={name}>{name}</a>
          </h3>
          <p class="song-row-artist">
            <ArtistLink {...artist} />
          </p>
        </div>
      </div>
      {data && (
        <PlayButton
          isActive={isActive}
          title={name}
          onClick={onClick}
        />
      )}
    </li>
  );
}
