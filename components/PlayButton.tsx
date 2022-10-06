import { useComputed } from "@preact/signals";

interface PlayButtonProps {
  isActive: boolean;
  onClick(): void;
}

export default function PlayButton({ isActive, onClick }: PlayButtonProps) {
  const title = useComputed(() => isActive ? "Pause Button" : "Play Button");
  const src = useComputed(() =>
    isActive ? "/pause.svg#pause" : "/play.svg#play"
  );
  return (
    <svg class="play-icon" onClick={onClick}>
      <title>{title}</title>
      <use href={src.value} />
    </svg>
  );
}
