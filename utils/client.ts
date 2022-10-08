import { useSignal } from "@preact/signals";
import { useMemo } from "preact/hooks";
import useSWR from "swr";
import type { Artist, SearchResult, Track } from "@/utils/types.ts";

export interface ResponseSignal<T> {
  readonly data: T | undefined;
  readonly error: Error | undefined;
}

export function useCharts(hasInitial = false) {
  const key = hasInitial ? null : "/api/charts";
  return useSWRSignal<readonly Track[]>(key);
}

export function useCountryCharts(id: string) {
  return useSWRSignal<readonly Track[]>(`/api/charts/country/${id}`);
}

export function useGenreCharts(id: string, hasInitial = false) {
  const key = hasInitial ? null : `/api/charts/genre/${id}`;
  return useSWRSignal<readonly Track[]>(key);
}

export function useRelatedSongs(id: string) {
  return useSWRSignal<readonly Track[]>(`/api/search/related/${id}`);
}

export function useMusicSearch(query: string) {
  return useSWRSignal<SearchResult>(`/api/search/${query}`);
}

export function useSongDetails(id: string) {
  return useSWRSignal<Track>(`/api/songs/${id}`);
}

export function useArtistDetails(id: string) {
  return useSWRSignal<Artist>(`/api/songs/artist/${id}`);
}

function useSWRSignal<T>(key: string | null): ResponseSignal<T> {
  const data = useSignal<T | undefined>(undefined);
  const error = useSignal<Error | undefined>(undefined);

  useSWR(key, null, {
    async fetcher(endpoint: string) {
      // console.log(`running fetch on ${endpoint}`);
      const response = await fetch(endpoint);
      return await response.json() as T;
    },
    use: [
      (next) => (...args) => {
        data.value = undefined;
        error.value = undefined;

        const result = next(...args);

        // console.log(`setting response on ${key}`);
        // keep eye on type assumptions here

        data.value = result.data as typeof data.value;
        error.value = result.error as typeof error.value;

        return result;
      },
    ],
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
