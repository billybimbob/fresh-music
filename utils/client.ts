import { useMemo } from "preact/hooks";
import { batch, useSignal } from "@preact/signals";
import useSWR from "swr";

import type { Artist, SearchResult, Track } from "@/utils/types.ts";
import endpoints from "@/utils/api.ts";
import { usePreload } from "@/utils/preload.ts";

export interface ResponseSignal<T> {
  readonly data: T | undefined;
  readonly error: Error | undefined;
}

export function useCharts() {
  return useSWRSignal<readonly Track[]>(endpoints.charts);
}

// export function useCountryCharts(id: string) {
//   return useSWRSignal<readonly Track[]>(`/api/charts/countries/${id}`);
// }

export function useGenreCharts(id: string) {
  return useSWRSignal<readonly Track[]>(endpoints.genreCharts(id));
}

export function useRelatedSongs(id: string) {
  return useSWRSignal<readonly Track[]>(endpoints.related(id));
}

export function useMusicSearch(query: string) {
  return useSWRSignal<SearchResult>(endpoints.search(query));
}

export function useSongDetails(id: string) {
  return useSWRSignal<Track>(endpoints.song(id));
}

export function useArtistDetails(id: string) {
  return useSWRSignal<Artist>(endpoints.artist(id));
}

function useSWRSignal<T>(key: string): ResponseSignal<T> {
  const data = useSignal<T | undefined>(undefined);
  const error = useSignal<Error | undefined>(undefined);
  const preload = usePreload();

  useSWR(key, null, {
    revalidateIfStale: false,
    revalidateOnMount: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    fallback: preload,

    use: [
      (next) => (...args) => {
        batch(() => {
          data.value = undefined;
          error.value = undefined;
        });

        const result = next(...args);

        // console.log("setting", args[0], "to", result.data, result.error);
        // console.log("fallback is", args[2].fallback);

        batch(() => {
          // keep eye on type assumptions here
          data.value = result.data as typeof data.value;
          error.value = result.error as typeof error.value;
        });

        return result;
      },
    ],

    isPaused: () => data.value !== undefined,

    fetcher: async (endpoint: string) => {
      console.log(`running fetch on ${endpoint}`);
      const response = await fetch(endpoint);
      return await response.json() as T;
    },
  });

  return useMemo(() => ({
    get data() {
      return data.value;
    },
    get error() {
      return error.value;
    },
  }), [data, error]);
}
