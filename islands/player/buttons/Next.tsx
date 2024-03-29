import { useComputed } from "@preact/signals";
import { asset } from "$fresh/runtime.ts";
import { useSongQueue } from "@/utils/songQueue.ts";

export default function Next() {
  const queue = useSongQueue();
  const title = useComputed(() => `To ${queue.upcoming.at(0)?.name ?? "Next"}`);
  const disabled = useComputed(() => !queue.hasNext);

  return (
    <button
      title={title}
      type="button"
      class="btn-icon"
      disabled={disabled}
      onClick={() => queue.seekNext()}
    >
      <svg class="next-icon">
        <title>{title}</title>
        <use href={asset("/icons/next.svg#next")} />
      </svg>
    </button>
  );
}
