import classes from "classNames/index.ts";
import type { Track } from "@/utils/types.ts";
import { useSongQueue } from "@/utils/songQueue.ts";

import ArtistLink from "@/components/ArtistLink.tsx";
import PlayButton from "@/components/PlayButton.tsx";

interface SongCardProps extends Track {
  onClick(): void;
}

export default function SongCard(
  { id, name, images, artist, onClick }: SongCardProps,
) {
  const queue = useSongQueue();

  const isActive = queue.isPlaying && queue.current?.id === id;

  const btn = classes({
    "song-card-btn": true,
    "song-card-btn-active": isActive,
  });

  return (
    <li class="song-card">
      <div class="song-card-left">
        <div class={btn}>
          <PlayButton isActive={isActive} onClick={onClick} />
        </div>
        <img class="song-card-img" alt={`${name} Image`} src={images?.cover} />
      </div>
      <div class="song-card-right">
        <p class="song-card-name">
          <a href={`/songs/${id}`}>{name}</a>
        </p>
        <p class="song-card-artist">
          <ArtistLink {...artist} />
        </p>
      </div>
    </li>
  );
}
