import { useContext } from "preact/hooks";
import { useComputed } from "@preact/signals";
import classes from "classnames";

import { type ArtistSong, toSize, type Track } from "@/utils/types.ts";
import { SongQueue } from "@/utils/songQueue.ts";
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
  const queue = useContext(SongQueue);

  const src = useComputed(() => {
    if (queue.current === null) return "";

    const { images = undefined } = queue.current as Track;
    if (images) return images.cover;

    const { artwork = undefined } = queue.current as ArtistSong;
    if (artwork) return toSize(artwork.url, 200);

    return "";
  });

  const title = useComputed(() => `${queue.current?.name ?? "Song"} Cover`);

  const poster = useComputed(() =>
    classes({
      "poster": true,
      "active": queue.isPlaying,
    })
  );

  const image = useComputed(() =>
    classes({
      "img": true,
      "none": queue.current === null,
    })
  );

  return (
    <div class={poster}>
      <img class={image} title={title} alt={title} src={src} />
    </div>
  );
}

function NowPlayingText() {
  const queue = useContext(SongQueue);

  if (queue.current === null) {
    return (
      <figcaption class="text">
        <p class="name">No Active Song</p>
        <p class="artist">No Active Song</p>
      </figcaption>
    );
  }

  return (
    <figcaption class="text">
      <p class="name" title={queue.current.name}>
        <a href={`/songs/${queue.current.id}`}>{queue.current.name}</a>
      </p>
      <ArtistLink {...queue.current.artist} />
    </figcaption>
  );
}
