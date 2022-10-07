import { type ReadonlySignal, useComputed } from "@preact/signals";

interface PlayButtonProps {
  isActive: ReadonlySignal<boolean>;
  onClick(): void;
}

export default function PlayButton({ isActive, onClick }: PlayButtonProps) {
  const title = useComputed(() =>
    isActive.value ? "Pause Button" : "Play Button"
  );
  const src = useComputed(() =>
    isActive.value ? "/pause.svg#pause" : "/play.svg#play"
  );
  return (
    <svg class="play-icon-browse" onClick={onClick}>
      <title>{title}</title>
      <use href={src.value} />
    </svg>
  );
}
