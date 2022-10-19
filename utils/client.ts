import { createContext } from "preact";
import { useContext, useMemo } from "preact/hooks";
import { batch, useSignal } from "@preact/signals";
import useSWR from "swr";
import type {
  Artist,
  PreloadData,
  SearchResult,
  Track,
} from "@/utils/types.ts";

export interface ResponseSignal<T> {
  readonly data: T | undefined;
  readonly error: Error | undefined;
}

export function useCharts() {
  return useSWRSignal<readonly Track[]>("/api/charts");
}

export function useGenreCharts(id: string) {
  return useSWRSignal<readonly Track[]>(`/api/charts/genres/${id}`);
}

// export function useCountryCharts(id: string) {
//   return useSWRSignal<readonly Track[]>(`/api/charts/countries/${id}`);
// }

export function useMusicSearch(query: string) {
  return useSWRSignal<SearchResult>(`/api/search/${query}`);
}

export function useSongDetails(id: string) {
  return useSWRSignal<Track>(`/api/songs/${id}`);
}

export function useRelatedSongs(id: string) {
  return useSWRSignal<readonly Track[]>(`/api/songs/related/${id}`);
}

export function useArtistDetails(id: string) {
  return useSWRSignal<Artist>(`/api/artists/${id}`);
}

const Fallback = createContext<PreloadData>({});

export const FallbackProvider = Fallback.Provider;

function useSWRSignal<T>(endpoint: string): ResponseSignal<T> {
  const data = useSignal<T | undefined>(undefined);
  const error = useSignal<Error | undefined>(undefined);
  const fallback = useContext(Fallback);

  useSWR(endpoint, null, {
    revalidateIfStale: false,
    revalidateOnMount: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    fallback,

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

    isPaused: () => {
      return data.value !== undefined;
    },

    fetcher: async () => {
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
