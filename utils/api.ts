import genres from "@/static/genres.json" assert { type: "json" };

const [{ value: firstGenre }] = genres;

export const charts = "/api/charts";

export const defaultGenre = `/api/charts/genres/${firstGenre}`;

export function artist(id: string) {
  return `/api/songs/artists/${id}`;
}

export function genreCharts(id: string) {
  return `/api/charts/genres/${id}`;
}

export function related(song: string) {
  return `/api/search/related/${song}`;
}

export function search(query: string) {
  return `/api/search/${query}`;
}

export function song(id: string) {
  return `/api/songs/${id}`;
}
