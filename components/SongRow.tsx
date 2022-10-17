import classes from "classnames/index.ts";
import type { Track } from "@/utils/types.ts";
import { useSongQueue } from "@/utils/songQueue.ts";

import ArtistLink from "@/components/ArtistLink.tsx";
import PlayButton from "@/components/PlayButton.tsx";

interface SongRowProps extends Track {
  readonly spot: number;
  onClick(): void;
}

export default function SongRow(
  { id, spot, name, artist, images, onClick }: SongRowProps,
) {
  const queue = useSongQueue();

  const isActive = queue.isPlaying && queue.current?.id === id;

  const row = classes({
    "song-row": true,
    "active": isActive,
  });

  return (
    <li class={row} onDblClick={onClick}>
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
      <PlayButton isActive={isActive} title={name} onClick={onClick} />
    </li>
  );
}
