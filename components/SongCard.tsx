import classes from "classnames";
import type { Track } from "@/utils/types.ts";
import { useSongQueue } from "@/utils/songQueue.ts";

import ArtistLink from "@/components/ArtistLink.tsx";
import PlayButton from "@/components/PlayButton.tsx";

interface SongCardProps extends Track {
  onClick(): void;
}

export default function SongCard(
  { id, name, data, images, artist, onClick }: SongCardProps,
) {
  const queue = useSongQueue();

  const isActive = queue.isPlaying && queue.current?.id === id;

  const card = classes({
    "song-card": true,
    "active": isActive,
    "disabled": data === undefined,
  });

  return (
    <li class={card}>
      <div
        title={`Play ${name}`}
        class="song-card-body"
        onClick={data ? onClick : undefined}
        tabIndex={0}
      >
        <div class="song-card-btn">
          {data && <PlayButton isActive={isActive} title={name} />}
        </div>
        <img class="song-card-img" alt={`${name} Image`} src={images?.cover} />
      </div>
      <div class="song-card-label">
        <p class="song-card-name">
          <a href={`/songs/${id}`} title={name}>{name}</a>
        </p>
        <p class="song-card-artist">
          <ArtistLink {...artist} />
        </p>
      </div>
    </li>
  );
}
