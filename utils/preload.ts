import { createContext } from "preact";
import { useContext } from "preact/hooks";
import type { Artist, SearchResult, Track } from "@/utils/types.ts";

export interface PreloadData {
  readonly [key: string]:
    | Artist
    | SearchResult
    | Track
    | readonly Track[]
    | undefined;
}

export const Preload = createContext<PreloadData>({});

export function usePreload(): PreloadData {
  return useContext(Preload);
}
