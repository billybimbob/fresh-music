import { batch, useSignal } from "@preact/signals";
import { createContext } from "preact";
import { useContext, useMemo } from "preact/hooks";
import type { Track } from "@/utils/types.ts";

export interface PreloadState {
  readonly charts: readonly Track[] | undefined;
  readonly genreCharts: readonly Track[] | undefined;
}

export const Preload = createContext<PreloadState>({
  charts: undefined,
  genreCharts: undefined,
});

export function usePreloadSource(
  initialCharts?: readonly Track[],
  initialGenre?: readonly Track[],
) {
  const charts = useSignal(initialCharts);
  const genreCharts = useSignal(initialGenre);

  return useMemo(() => ({
    get charts() {
      return charts.value;
    },

    get genreCharts() {
      return genreCharts.value;
    },

    clear() {
      batch(() => {
        charts.value = undefined;
        genreCharts.value = undefined;
      });
    },
  }), [charts, genreCharts]);
}

export function usePreload(): PreloadState {
  return useContext(Preload);
}
