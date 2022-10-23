import { useEffect } from "preact/hooks";
import { type Signal, useComputed } from "@preact/signals";
import { asset } from "$fresh/runtime.ts";

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
  }, [volume]);

  useEffect(() => {
    const saveVolume = () => {
      localStorage.setItem(VOLUME_PREF, volume.value.toString());
    };
    addEventListener("beforeunload", saveVolume);
    return () => {
      removeEventListener("beforeunload", saveVolume);
    };
  }, [volume]);

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
        value={volume}
        onChange={onChange}
      />
    </div>
  );
}

function VolumeButton({ volume }: VolumeProps) {
  const title = useComputed(() =>
    volume.value === 0 ? "Max Volume" : "Mute Volume"
  );

  const href = useComputed(() => {
    const svg = (
      volume.value === 0 && "volume-mute.svg#volume-mute" ||
      volume.value <= 0.5 && "volume-low.svg#volume-low" ||
      "volume-high.svg#volume-high"
    );

    return asset(`/icons/${svg}`);
  });

  const onClick = () => {
    if (volume.value === 0) {
      volume.value = 1;
    } else {
      volume.value = 0;
    }
  };

  return (
    <button
      type="button"
      title={title}
      class="btn-icon"
      onClick={onClick}
    >
      <svg class="volume-icon">
        <title>{title}</title>
        <use href={href} />
      </svg>
    </button>
  );
}
