import { useContext, useEffect } from "preact/hooks";
import { type Signal } from "@preact/signals";
import SongQueue from "@/utils/songQueue.ts";

import Loop from "@/components/player/buttons/Loop.tsx";
import Next from "@/components/player/buttons/Next.tsx";
import Playback from "@/components/player/buttons/Playback.tsx";
import Previous from "@/components/player/buttons/Previous.tsx";
import Shuffle from "@/components/player/buttons/Shuffle.tsx";

interface ControlProps {
  readonly loop: Signal<boolean>;
}

export default function Controls({ loop }: ControlProps) {
  const queue = useContext(SongQueue);

  useEffect(() => {
    const onKeyUp = (event: KeyboardEvent) => {
      const { key, shiftKey } = event;

      if (key === " ") {
        event.stopPropagation();
        event.preventDefault();
        queue.toggle();
        return;
      }

      if (!shiftKey) {
        return;
      }

      if (key === "ArrowLeft" && queue.hasPrevious) {
        queue.seekPrevious();
        return;
      }

      if (key === "ArrowRight" && queue.hasNext) {
        queue.seekNext();
        return;
      }
    };

    addEventListener("keyup", onKeyUp);

    return () => {
      removeEventListener("keyup", onKeyUp);
    };
  }, [queue]);

  return (
    <div class="playback-buttons">
      <Loop value={loop} />
      <Previous />
      <Playback />
      <Next />
      <Shuffle />
    </div>
  );
}
