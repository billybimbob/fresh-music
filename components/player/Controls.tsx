import { useContext, useEffect } from "preact/hooks";
import { type Signal } from "@preact/signals";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { SongQueue } from "@/utils/songQueue.ts";

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
    if (!IS_BROWSER) return;

    const controlPlayback = (event: KeyboardEvent) => {
      if (document.activeElement?.id === "search-music") {
        return;
      }

      const { key, shiftKey } = event;

      if (key === " ") {
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

    addEventListener("keyup", controlPlayback);

    return () => {
      removeEventListener("keyup", controlPlayback);
    };
  }, [queue]);

  useEffect(() => {
    if (!IS_BROWSER) return;

    const preventScroll = (event: KeyboardEvent) => {
      if (document.activeElement?.id === "search-music") return;
      if (event.key !== " ") return;
      event.preventDefault();
    };

    addEventListener("keydown", preventScroll);

    return () => {
      removeEventListener("keydown", preventScroll);
    };
  }, [queue]);

  return (
    <div class="controls">
      <Loop value={loop} />
      <Previous />
      <Playback />
      <Next />
      <Shuffle />
    </div>
  );
}
