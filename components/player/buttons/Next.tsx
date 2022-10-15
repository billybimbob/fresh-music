import { useComputed } from "@preact/signals";
import { useSongQueue } from "@/utils/songQueue.ts";

export default function Next() {
  const queue = useSongQueue();
  const title = useComputed(() => `To ${queue.upcoming.at(0)?.name ?? "Next"}`);
  const disabled = useComputed(() => !queue.hasNext);

  return (
    <button
      title={title.value}
      type="button"
      class="btn-icon"
      disabled={disabled.value}
      onClick={queue.seekNext}
    >
      <svg class="seek-icon">
        <title>{title}</title>
        <use href="/icons/next.svg#next" />
      </svg>
    </button>
  );
}
