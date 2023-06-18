import { useSignal } from "@preact/signals";

import Audio from "@/islands/player/Audio.tsx";
import Controls from "@/islands/player/Controls.tsx";
import NowPlaying from "@/islands/player/NowPlaying.tsx";
import SeekBar from "@/islands/player/SeekBar.tsx";
import Volume from "@/islands/player/Volume.tsx";

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
      <div class="playback">
        <Controls loop={loop} />
        <SeekBar
          progression={progression}
          duration={duration}
          onSeek={onSeek}
        />
      </div>
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
