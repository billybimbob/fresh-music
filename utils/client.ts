import useSWR from "swr";
import type { Artist, SearchResult, Track } from "@/utils/types.ts";

async function fetchJson(endpoint: string) {
  const response = await fetch(endpoint);
  return response.json();
}

export function useCharts(hasInitial = false) {
  return useSWR<readonly Track[], Error>(
    hasInitial ? null : "/api/charts",
    fetchJson,
  );
}

export function useCountryCharts(id: string) {
  return useSWR<readonly Track[], Error>(
    `/api/charts/country/${id}`,
    fetchJson,
  );
}

export function useGenreCharts(id: string, hasInitial = false) {
  return useSWR<readonly Track[], Error>(
    hasInitial ? null : `/api/charts/genre/${id}`,
    fetchJson,
  );
}

export function useRelatedSongs(id: string) {
  return useSWR<readonly Track[], Error>(
    `/api/search/related/${id}`,
    fetchJson,
  );
}

export function useMusicSearch(query: string) {
  return useSWR<SearchResult, Error>(`/api/search/${query}`, fetchJson);
}

export function useSongDetails(id: string) {
  return useSWR<Track, Error>(`/api/songs/${id}`, fetchJson);
}

export function useArtistDetails(id: string) {
  return useSWR<Artist, Error>(`/api/songs/artist/${id}`, fetchJson);
}
