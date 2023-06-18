import { useContext } from "preact/hooks";
import { useComputed } from "@preact/signals";
import classes from "classnames";

import type { Track } from "@/utils/types.ts";
import { useWatcher } from "@/utils/watcher.ts";
import { useSongQueue } from "@/utils/playback/mod.ts";

import ArtistLink from "@/components/ArtistLink.tsx";
import PlayButton from "@/components/PlayButton.tsx";

interface SongCardProps extends Track {
  onClick: () => void;
}

export default function SongCard(
  { id, name, data, images, artist, onClick }: SongCardProps,
) {
  const $id = useWatcher(id);
  const $data = useWatcher(data);
  const queue = useSongQueue();

  const isActive = useComputed(() =>
    queue.isPlaying && queue.current?.id === $id.value
  );

  const $class = useComputed(() =>
    classes({
      "song-card": true,
      "active": isActive.value,
      "disabled": $data.value === undefined,
    })
  );

  return (
    <li class={$class}>
      <div
        title={`Play ${name}`}
        class="body"
        onClick={data ? onClick : undefined}
        tabIndex={0}
      >
        <div class="btn">
          {data
            ? (
              <PlayButton
                isActive={isActive}
                title={name}
                tabIndex={-1}
              />
            )
            : <div class="play-icon empty" />}
        </div>
        <img class="img" alt={`${name} Image`} src={images?.cover} />
      </div>
      <div class="label">
        <p class="name" title={name}>
          <a href={`/songs/${id}`}>{name}</a>
        </p>
        <ArtistLink {...artist} />
      </div>
    </li>
  );
}
