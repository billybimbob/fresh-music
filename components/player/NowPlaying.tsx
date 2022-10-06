import { useComputed } from "@preact/signals";
import classes from "classNames/index.ts";
import queue from "@/utils/songQueue.ts";

export default function NowPlaying() {
  const poster = useComputed(() =>
    classes({
      "now-playing-poster": true,
      "now-playing-active": queue.isPlaying,
    })
  );

  const imageAlt = useComputed(() =>
    queue.current === null ? undefined : `${queue.current.name} Cover`
  );

  return (
    <figure class="now-playing">
      <div class={poster.value}>
        <img
          class="now-playing-img"
          src={queue.current?.data}
          alt={imageAlt.value}
        />
      </div>
      <figcaption class="now-playing-text">
        <p class="now-playing-name">
          {queue.current?.name ?? "No Active Song"}
        </p>
        <p class="now-playing-artist">
          {queue.current?.artist ?? "No Active Song"}
        </p>
      </figcaption>
    </figure>
  );
}
