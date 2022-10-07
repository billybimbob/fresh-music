import { useComputed } from "@preact/signals";
import classes from "classNames/index.ts";

import type { Track } from "@/utils/types.ts";
import { useSongQueue } from "@/utils/songQueue.ts";
import PlayButton from "@/components/PlayButton.tsx";

interface SongCardProps extends Track {
  onClick(): void;
}

export default function SongCard(
  { id, name, images, artist, onClick }: SongCardProps,
) {
  const queue = useSongQueue();

  const artistId = useComputed(() => artist.ids[0]);

  const isActive = useComputed(() =>
    queue.isPlaying && queue.current?.id === id
  );

  const btn = useComputed(() =>
    classes({
      "song-card-btn": true,
      "song-card-btn-active": isActive.value,
    })
  );

  return (
    <li class="song-card">
      <div class="song-card-left">
        <div class={btn.value}>
          <PlayButton isActive={isActive.value} onClick={onClick} />
        </div>
        <img class="song-card-img" alt={`${name} Image`} src={images?.cover} />
      </div>
      <div class="song-card-right">
        <p class="song-card-name">
          <a href={`/songs/${id}`}>{name}</a>
        </p>
        <p class="song-card-artist">
          <a href={`/artists/${artistId}`}>{artist.name}</a>
        </p>
      </div>
    </li>
  );
}
