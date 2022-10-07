import { useSignal } from "@preact/signals";
import {
  Audio,
  NowPlaying,
  Playback,
  Volume,
} from "@/components/player/mod.ts";

export default function SongPlayer() {
  const progression = useSignal(0);
  const duration = useSignal(0);
  const volume = useSignal(0);
  const seek = useSignal(0);
  const loop = useSignal(false);

  const onSeek = (value: number) => {
    seek.value = value;
  };

  const onProgress = (value: number) => {
    progression.value = value;
  };

  const onDurationFound = (value: number) => {
    duration.value = value;
  };

  return (
    <aside class="song-player">
      <NowPlaying />
      <Playback
        loop={loop}
        progression={progression}
        duration={duration}
        onSeek={onSeek}
      />
      <Audio
        volume={volume}
        seek={seek}
        loop={loop}
        onProgress={onProgress}
        onDurationFound={onDurationFound}
      />
      <Volume volume={volume} />
    </aside>
  );
}
