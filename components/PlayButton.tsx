interface PlayButtonProps {
  isActive: boolean;
  onClick(): void;
}

export default function PlayButton({ isActive, onClick }: PlayButtonProps) {
  const src = isActive ? "/pause.svg#pause" : "/play.svg#play";
  const title = isActive ? "Pause Button" : "Play Button";
  return (
    <svg class="play-icon" onClick={onClick}>
      <title>{title}</title>
      <use href={src} />
    </svg>
  );
}
