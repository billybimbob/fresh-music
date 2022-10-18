import { useComputed } from "@preact/signals";
import classes from "classnames";

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
  const title = useComputed(() => `${queue.current?.name ?? "Song"} Cover`);

  const poster = useComputed(() =>
    classes({
      "now-playing-poster": true,
      "active": queue.isPlaying,
    })
  );

  const image = useComputed(() =>
    classes({
      "now-playing-img": true,
      "none": queue.current === null,
    })
  );

  const src = useComputed(() => {
    if (queue.current === null) {
      return "";
    }

    const { images = undefined } = queue.current as Track;
    if (images !== undefined) {
      return images.cover;
    }

    const { artwork = undefined } = queue.current as ArtistSong;
    if (artwork !== undefined) {
      return toSize(artwork.url, 200);
    }

    return "";
  });

  return (
    <div class={poster}>
      <img class={image} title={title} alt={title} src={src} />
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
      <p class="now-playing-name" title={queue.current.name}>
        <a href={`/songs/${queue.current.id}`}>{queue.current.name}</a>
      </p>
      <p class="now-playing-artist" title={queue.current.artist.name}>
        <ArtistLink {...queue.current.artist} />
      </p>
    </figcaption>
  );
}
