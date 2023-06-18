import { useComputed } from "@preact/signals";
import { asset } from "$fresh/runtime.ts";
import { useSongQueue } from "@/utils/songQueue.ts";

export default function Previous() {
  const queue = useSongQueue();
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
      onClick={queue.seekPrevious}
    >
      <svg class="prev-icon">
        <title>{title}</title>
        <use href={asset("/icons/previous.svg#previous")} />
      </svg>
    </button>
  );
}
