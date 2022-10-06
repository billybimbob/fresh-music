import type { ReadonlySignal, Signal } from "@preact/signals";
import PlayButtons from "@/components/player/PlayButtons.tsx";
import SeekBar from "@/components/player/SeekBar.tsx";

interface PlaybackProps {
  readonly loop: Signal<boolean>;
  readonly progression: ReadonlySignal<number>;
  readonly duration: ReadonlySignal<number>;
  onSeek(seek: number): void;
}

export default function Playback(
  { loop, progression, duration, onSeek }: PlaybackProps,
) {
  return (
    <div class="playback">
      <PlayButtons loop={loop} />
      <SeekBar progression={progression} duration={duration} onSeek={onSeek} />
    </div>
  );
}
