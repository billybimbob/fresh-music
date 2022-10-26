import { useContext } from "preact/hooks";
import { useComputed } from "@preact/signals";
import { asset } from "$fresh/runtime.ts";
import SongQueue from "@/utils/songQueue.ts";

export default function Playback() {
  const queue = useContext(SongQueue);
  const disabled = useComputed(() => queue.current === null);

  const title = useComputed(() =>
    `${queue.isPlaying ? "Pause" : "Play"} ${queue.current?.name ?? "Song"}`
  );

  const href = useComputed(() => {
    const svg = queue.isPlaying ? "pause.svg#pause" : "play.svg#play";
    return asset(`/icons/${svg}`);
  });

  return (
    <button
      title={title}
      type="button"
      class="btn-icon"
      disabled={disabled}
      onClick={queue.toggle.bind(queue)}
    >
      <svg class="play-icon">
        <title>{title}</title>
        <use href={href} />
      </svg>
    </button>
  );
}
