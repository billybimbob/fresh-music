import { useContext } from "preact/hooks";
import { useComputed } from "@preact/signals";
import classes from "classnames";

import type { Track } from "@/utils/types.ts";
import SongQueue from "@/utils/songQueue.ts";

import ArtistLink from "@/components/ArtistLink.tsx";
import PlayButton from "@/components/PlayButton.tsx";

interface SongCardProps extends Track {
  onClick(): void;
}

export default function SongCard(
  { id, name, data, images, artist, onClick }: SongCardProps,
) {
  const queue = useContext(SongQueue);

  const isActive = useComputed(() =>
    queue.isPlaying && queue.current?.id === id
  );

  const $class = useComputed(() =>
    classes({
      "song-card": true,
      "active": isActive.value,
      "disabled": data === undefined,
    })
  );

  return (
    <li class={$class}>
      <div
        title={`Play ${name}`}
        class="song-card-body"
        onClick={data ? onClick : undefined}
        tabIndex={0}
      >
        <div class="song-card-btn">
          {data && (
            <PlayButton
              isActive={isActive}
              title={name}
              tabIndex={-1}
            />
          )}
        </div>
        <img class="song-card-img" alt={`${name} Image`} src={images?.cover} />
      </div>
      <div class="song-card-label">
        <p class="song-card-name" title={name}>
          <a href={`/songs/${id}`}>{name}</a>
        </p>
        <p class="song-card-artist">
          <ArtistLink {...artist} />
        </p>
      </div>
    </li>
  );
}
