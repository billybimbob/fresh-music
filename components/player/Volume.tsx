import { useEffect } from "preact/hooks";
import { type Signal } from "@preact/signals";

interface VolumeProps {
  readonly volume: Signal<number>;
}

const VOLUME_PREF = "volume_preference";

export default function Volume({ volume }: VolumeProps) {
  useEffect(() => {
    const perf = parseFloat(localStorage.getItem(VOLUME_PREF) ?? "");

    if (isFinite(perf)) {
      volume.value = perf;
    }

    const saveVolume = () => {
      localStorage.setItem(VOLUME_PREF, volume.value.toString());
    };

    addEventListener("beforeunload", saveVolume);

    return () => {
      removeEventListener("beforeunload", saveVolume);
    };
  }, []);

  const onChange = (event: Event) => {
    const { valueAsNumber = undefined } = event.target as HTMLInputElement;
    if (valueAsNumber !== undefined) {
      volume.value = valueAsNumber;
    }
  };

  return (
    <div class="volume-bar">
      <VolumeButton volume={volume} />
      <input
        title="Volume Slider"
        name="volume-field"
        class="volume-field"
        type="range"
        step="any"
        min="0"
        max="1"
        value={volume.value}
        onChange={onChange}
      />
    </div>
  );
}

function VolumeButton({ volume }: VolumeProps) {
  if (volume.value === 0) {
    return (
      <button
        type="button"
        title="To Max Volume"
        class="btn-icon"
        onClick={() => volume.value = 1}
      >
        <svg class="volume-icon">
          <title>To Max Volume</title>
          <use href="/icons/volume-mute.svg#volume-mute" />
        </svg>
      </button>
    );
  }

  if (volume.value > 0.5) {
    return (
      <button
        type="button"
        title="Mute Volume"
        class="btn-icon"
        onClick={() => volume.value = 0}
      >
        <svg class="volume-icon">
          <title>Mute Volume</title>
          <use href="/icons/volume-high.svg#volume-high" />
        </svg>
      </button>
    );
  }

  return (
    <button
      type="button"
      title="Mute Volume"
      class="btn-icon"
      onClick={() => volume.value = 0}
    >
      <svg class="volume-icon" onClick={() => volume.value = 0}>
        <title>Mute Volume</title>
        <use href="/icons/volume-low.svg#volume-low" />
      </svg>
    </button>
  );
}
