import { type ReadonlySignal, useComputed } from "@preact/signals";
import { asset } from "$fresh/runtime.ts";
import { useWatcher } from "@/utils/signals.ts";

interface PlayButtonProps {
  readonly isActive: ReadonlySignal<boolean>;
  readonly title: string;
  readonly tabIndex?: number;
  onClick?: () => void;
}

export default function PlayButton(
  { isActive, title: songTitle, tabIndex, onClick }: PlayButtonProps,
) {
  const $songTitle = useWatcher(songTitle);

  const $title = useComputed(() =>
    isActive.value ? `Pause ${$songTitle}` : `Play ${$songTitle}`
  );

  const href = useComputed(() => {
    const svg = isActive.value ? "pause.svg#pause" : "play.svg#play";
    return asset(`/icons/${svg}`);
  });

  return (
    <button
      type="button"
      title={$title}
      class="btn-icon"
      onClick={onClick}
      tabIndex={tabIndex}
    >
      <svg class="play-icon browse">
        <title>{$title}</title>
        <use href={href} />
      </svg>
    </button>
  );
}
