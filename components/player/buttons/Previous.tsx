import { useContext } from "preact/hooks";
import { useComputed } from "@preact/signals";
import { asset } from "$fresh/runtime.ts";
import { SongQueue } from "@/utils/songQueue.ts";

export default function Previous() {
  const queue = useContext(SongQueue);
  const disabled = useComputed(() => !queue.hasPrevious);

  const title = useComputed(() =>
    `To ${queue.finished.at(-1)?.name ?? "Previous"}`
  );

  return (
    <button
      title={title}
      type="button"
      class="btn-icon"
      disabled={disabled}
      onClick={queue.seekPrevious.bind(queue)}
    >
      <svg class="prev-icon">
        <title>{title}</title>
        <use href={asset("/icons/previous.svg#previous")} />
      </svg>
    </button>
  );
}
