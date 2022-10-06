import { batch, signal } from "@preact/signals";
import { useEffect } from "preact/hooks";

import genres from "@/static/genres.json" assert { type: "json" };
import type { Track } from "@/utils/types.ts";
import fetchShazam from "@/utils/shazam.ts";

const charts = signal(undefined as readonly Track[] | undefined);
const genreCharts = signal(undefined as readonly Track[] | undefined);

export default {
  get charts() {
    return charts.value;
  },

  get genre() {
    return genreCharts.value;
  },
};

export function useInitialPreload(
  initialCharts?: readonly Track[],
  initialGenre?: readonly Track[],
) {
  useEffect(() => {
    batch(() => {
      charts.value = initialCharts;
      genreCharts.value = initialGenre;
    });
  }, [initialCharts, initialGenre]);

  return clear;
}

function clear() {
  batch(() => {
    charts.value = undefined;
    genreCharts.value = undefined;
  });
}

export interface PreloadResult {
  charts?: readonly Track[];
  genre?: readonly Track[];
}

const [{ value: defaultGenre }] = genres;

export async function fetchPreload(): Promise<PreloadResult> {
  const fetchChart = fetchShazam("/charts/world");

  const fetchGenre = fetchShazam("/charts/genre-world", {
    genre_code: defaultGenre,
  });

  const [charts, genre] = await Promise.all([
    fetchChart.then(tryJson),
    fetchGenre.then(tryJson),
  ]);

  return { charts, genre };
}

function tryJson(response: Response): Promise<readonly Track[]> | undefined {
  return response.ok ? response.json() : undefined;
}
