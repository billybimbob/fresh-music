import { useEffect } from "preact/hooks";
import { type Signal, useSignalEffect } from "@preact/signals";
import { IS_BROWSER } from "$fresh/runtime.ts";

import Loop from "@/islands/player/buttons/Loop.tsx";
import Next from "@/islands/player/buttons/Next.tsx";
import Playback from "@/islands/player/buttons/Playback.tsx";
import Previous from "@/islands/player/buttons/Previous.tsx";
import Shuffle from "@/islands/player/buttons/Shuffle.tsx";

import { useSongQueue } from "@/utils/playback/mod.ts";

interface ControlProps {
  loop: Signal<boolean>;
}

export default function Controls({ loop }: ControlProps) {
  const queue = useSongQueue();

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
