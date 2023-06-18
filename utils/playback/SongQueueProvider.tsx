import { type ComponentChildren, createContext } from "preact";
import { useContext, useState } from "preact/hooks";
import {
  SongQueueSignal,
  type SongQueueSource,
} from "@/utils/playback/songQueueSignal.ts";

const SongQueueContext = createContext(new SongQueueSignal());

interface SongQueueProviderProps {
  source: SongQueueSource;
  children: ComponentChildren;
}

export function SongQueueProvider(props: SongQueueProviderProps) {
  const [value, _] = useState(() => new SongQueueSignal(props.source));
  return (
    <SongQueueContext.Provider value={value}>
      {props.children}
    </SongQueueContext.Provider>
  );
}

export function useSongQueue() {
  return useContext(SongQueueContext);
}
