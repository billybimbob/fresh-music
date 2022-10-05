import { useComputed } from "@preact/signals";
import classes from "classNames/index.ts";
import type { Track } from "@/utils/types.ts";
import queue from "@/utils/songQueue.ts";
import PlayButton from "@/components/PlayButton.tsx";

interface SongRowProps extends Track {
  readonly spot: number;
  onClick(): void;
}

export default function SongRow(
  { id, spot, name, artist, images, onClick }: SongRowProps,
) {
  const isActive = useComputed(() => queue.current?.id === id);

  const row = useComputed(() =>
    classes({
      "song-row-item": true,
      "song-row-active": isActive.value,
    })
  );

  return (
    <li class={row.value}>
      <h3 class="song-row-spot">{spot}</h3>
      <div class="song-row-body">
        <img
          class="song-row-img"
          alt={`${name} Artwork`}
          src={images.cover}
        />
        <div class="song-row-title">
          <a href={`/songs/${id}`}>
            <p class="song-row-name">{name}</p>
          </a>
          <p class="song-row-artist">{artist.name}</p>
        </div>
      </div>
      <PlayButton isActive={isActive.value} onClick={onClick} />
    </li>
  );
}