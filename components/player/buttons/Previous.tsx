import { useComputed } from "@preact/signals";
import { useSongQueue } from "@/utils/songQueue.ts";

export default function Previous() {
  const queue = useSongQueue();
  const disabled = useComputed(() => !queue.hasPrevious);

  const title = useComputed(() =>
    `To ${queue.finished.at(-1)?.name ?? "Previous"}`
  );

  return (
    <button
      title={title.value}
      type="button"
      class="btn-icon"
      disabled={disabled.value}
      onClick={queue.seekPrevious}
    >
      <svg class="seek-icon">
        <title>{title}</title>
        <use href="/icons/previous.svg#previous" />
      </svg>
    </button>
  );
}
