import { useComputed } from "@preact/signals";
import { asset } from "$fresh/runtime.ts";
import { useSongQueue } from "@/utils/songQueue.ts";

export default function Playback() {
  const queue = useSongQueue();
  const disabled = useComputed(() => queue.current === null);

  const title = useComputed(() =>
    `${queue.isPlaying ? "Pause" : "Play"} ${queue.current?.name ?? "Song"}`
  );

  const href = useComputed(() =>
    asset(queue.isPlaying ? "/icons/pause.svg#pause" : "/icons/play.svg#play")
  );

  return (
    <button
      title={title}
      type="button"
      class="btn-icon"
      disabled={disabled}
      onClick={queue.toggle}
    >
      <svg class="play-icon">
        <title>{title}</title>
        <use href={href} />
      </svg>
    </button>
  );
}
