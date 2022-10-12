import genres from "@/static/genres.json" assert { type: "json" };

const [{ value: firstGenre }] = genres;

const endpoints = Object.freeze({
  charts: "/api/charts",
  defaultGenre: `/api/charts/genres/${firstGenre}`,
  artist: (id: string) => `/api/songs/artists/${id}`,
  genreCharts: (id: string) => `/api/charts/genres/${id}`,
  related: (song: string) => `/api/search/related/${song}`,
  search: (query: string) => `/api/search/${query}`,
  song: (id: string) => `/api/songs/${id}`,
});

export default endpoints;
