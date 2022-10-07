import {
  batch,
  type Signal,
  useSignal,
  useSignalEffect,
} from "@preact/signals";

interface VolumeProps {
  readonly volume: Signal<number>;
}

const VOLUME_PREF = "volume_preference";

export default function Volume({ volume }: VolumeProps) {
  const isLoaded = useSignal(false);

  useSignalEffect(() => {
    if (isLoaded.value) return;

    batch(() => {
      isLoaded.value = true;

      const prefString = localStorage.getItem(VOLUME_PREF);
      if (prefString === null) return;

      const pref = parseInt(prefString);
      if (isNaN(pref)) return;

      volume.value = pref;
    });
  });

  useSignalEffect(() => {
    // keep eye on performance, possibly debounce
    localStorage.setItem(VOLUME_PREF, volume.value.toString());
  });

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
      <svg class="volume-icon" onClick={() => volume.value = 1}>
        <title>Volume Mute</title>
        <use href="/volume-mute.svg#volume-mute" />
      </svg>
    );
  }

  if (volume.value > 0.5) {
    return (
      <svg class="volume-icon" onClick={() => volume.value = 0}>
        <title>Volume High</title>
        <use href="/volume-high.svg#volume-high" />
      </svg>
    );
  }

  return (
    <svg class="volume-icon" onClick={() => volume.value = 0}>
      <title>Volume Low</title>
      <use href="/volume-low.svg#volume-low" />
    </svg>
  );
}
