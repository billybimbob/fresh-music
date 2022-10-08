interface PlayButtonProps {
  isActive: boolean;
  onClick(): void;
}

export default function PlayButton({ isActive, onClick }: PlayButtonProps) {
  if (isActive) {
    return (
      <svg class="play-icon-browse" onClick={onClick}>
        <title>Pause Button</title>
        <use href="/pause.svg#pause" />
      </svg>
    );
  } else {
    return (
      <svg class="play-icon-browse" onClick={onClick}>
        <title>Play Button</title>
        <use href="/play.svg#play" />
      </svg>
    );
  }
}
