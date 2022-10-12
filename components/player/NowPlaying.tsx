import { useComputed } from "@preact/signals";
import classes from "classNames/index.ts";

import { type ArtistSong, toSize, type Track } from "@/utils/types.ts";
import { useSongQueue } from "@/utils/songQueue.ts";
import ArtistLink from "@/components/ArtistLink.tsx";

export default function NowPlaying() {
  return (
    <figure class="now-playing">
      <NowPlayingImage />
      <NowPlayingText />
    </figure>
  );
}

function NowPlayingImage() {
  const queue = useSongQueue();

  const imageSrc = useComputed(() => {
    if (queue.current === null) {
      return undefined;
    }

    const { images = undefined } = queue.current as Track;

    if (images !== undefined) {
      return images.cover;
    }

    const { artwork = undefined } = queue.current as ArtistSong;

    if (artwork !== undefined) {
      return toSize(artwork.url, 200);
    }

    return undefined;
  });

  const poster = useComputed(() =>
    classes({
      "now-playing-poster": true,
      "active": queue.isPlaying,
    })
  );

  if (queue.current === null) {
    return (
      <div class={poster.value}>
        <div
          class="now-playing-img now-playing-none"
          aria-hidden={true}
        />
      </div>
    );
  }

  return (
    <div class={poster.value}>
      <img
        title="Now Playing Art"
        class="now-playing-img"
        src={imageSrc.value}
        alt={`${queue.current.name} Cover`}
      />
    </div>
  );
}

function NowPlayingText() {
  const queue = useSongQueue();

  if (queue.current === null) {
    return (
      <figcaption class="now-playing-text">
        <p class="now-playing-name">No Active Song</p>
        <p class="now-playing-artist">No Active Song</p>
      </figcaption>
    );
  }

  return (
    <figcaption class="now-playing-text">
      <p class="now-playing-name">
        <a href={`/songs/${queue.current.id}`} title={queue.current.name}>
          {queue.current.name}
        </a>
      </p>
      <p class="now-playing-artist">
        <ArtistLink {...queue.current.artist} />
      </p>
    </figcaption>
  );
}
