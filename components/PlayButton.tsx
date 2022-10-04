interface PlayButtonProps {
  isActive: boolean;
  onClick(): void;
}

export default function PlayButton({ isActive, onClick }: PlayButtonProps) {
  const src = isActive ? "/pause.svg" : "/play.svg";
  return <input type="image" src={src} onClick={onClick} class="play-btn" />;
}
