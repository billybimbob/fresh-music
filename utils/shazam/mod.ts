// import { Status } from "$fresh/server.ts";
// import { IS_BROWSER } from "$fresh/runtime.ts";
// import genres from "@/static/genres.json" assert { type: "json" };
import * as convert from "@/utils/shazam/conversions.ts";
import type {
  ShazamArtist,
  ShazamSearch,
  ShazamTrack,
} from "@/utils/shazam/types.ts";

// const [{ value: defaultGenre }] = genres;

// export async function fetchGenreCharts(id?: string) {
//   const response = await fetchShazam("charts/genre-world", {
//     genre_code: id ?? defaultGenre,
//   });

//   if (!response.ok) return null;

//   const data: readonly ShazamTrack[] = await response.json();

//   return data.map(convert.toTrack);
// }

// export async function fetchCountryCharts(id: string) {
//   const response = await fetchShazam("charts/country", {
//     country_code: id,
//   });

//   if (!response.ok) return null;

//   const data: readonly ShazamTrack[] = await response.json();

//   return data.map(convert.toTrack);
// }

// export async function fetchWorldCharts() {
//   const response = await fetchShazam("charts/world");

//   if (!response.ok) return null;

//   const data: readonly ShazamTrack[] = await response.json();

//   return data.map(convert.toTrack);
// }

// export async function fetchRelatedSongs(song: string) {
//   const response = await fetchShazam("tracks/related", { track_id: song });

//   if (!response.ok) return null;

//   const data: readonly ShazamTrack[] = await response.json();

//   return data.map(convert.toTrack);
// }

// export async function fetchSearch(query: string) {
//   const response = await fetchShazam("search/multi", {
//     search_type: "SONGS_ARTISTS",
//     query,
//   });

//   if (!response.ok) return null;

//   const data: ShazamSearch = await response.json();

//   return {
//     tracks: data.tracks.hits
//       .map(({ track }) => track)
//       .map(convert.toTrack),

//     artists: data.artists.hits
//       .map(({ artist }) => artist)
//       .map(convert.toArtistPreview),
//   };
// }

// export async function fetchArtist(id: string) {
//   const response = await fetchShazam("artists/details", { artist_id: id });

//   if (!response.ok) return null;

//   const data: ShazamArtist = await response.json();

//   return convert.toArtist(data);
// }

// export async function fetchSong(id: string) {
//   const response = await fetchShazam("tracks/details", { track_id: id });

//   if (!response.ok) return null;

//   const data: ShazamTrack = await response.json();

//   return convert.toTrack(data);
// }

// const baseUrl = "https://shazam-core.p.rapidapi.com/v1/";

// const shazamKey = Deno.env.get("SHAZAM_KEY");

// async function fetchShazam(endpoint: string, params?: Record<string, string>) {
//   if (IS_BROWSER) {
//     return new Response("Cannot request from the browser", {
//       status: Status.Unauthorized,
//     });
//   }

//   if (shazamKey === undefined) {
//     return new Response("Api key cannot be found", {
//       status: Status.BadRequest,
//     });
//   }

//   const url = new URL(endpoint, baseUrl);

//   if (params !== undefined) {
//     for (const [name, value] of Object.entries(params)) {
//       url.searchParams.set(name, value);
//     }
//   }

//   return await fetch(url, {
//     method: "GET",
//     headers: {
//       "X-RapidAPI-Key": shazamKey,
//     },
//   });
// }

const RESPONSE_LOC = "./responses";

export async function fetchGenreCharts(_id?: string) {
  const contents = await Deno.readTextFile(`${RESPONSE_LOC}/charts-genre.json`);

  const data: readonly ShazamTrack[] = JSON.parse(contents);

  return data.map(convert.toTrack);
}

export async function fetchCountryCharts(_id: string) {
  const contents = await Deno.readTextFile(
    `${RESPONSE_LOC}/charts-country.json`,
  );

  const data: readonly ShazamTrack[] = JSON.parse(contents);

  return data.map(convert.toTrack);
}

export async function fetchWorldCharts() {
  const contents = await Deno.readTextFile(`${RESPONSE_LOC}/charts-world.json`);

  const data: readonly ShazamTrack[] = JSON.parse(contents);

  return data.map(convert.toTrack);
}

export async function fetchRelatedSongs(_song: string) {
  const contents = await Deno.readTextFile(
    `${RESPONSE_LOC}/related-tracks.json`,
  );

  const data: readonly ShazamTrack[] = await JSON.parse(contents);

  return data.map(convert.toTrack);
}

export async function fetchSearch(_query: string) {
  const contents = await Deno.readTextFile(`${RESPONSE_LOC}/multi-search.json`);

  const data: ShazamSearch = JSON.parse(contents);

  return {
    tracks: data.tracks.hits
      .map(({ track }) => track)
      .map(convert.toTrack),

    artists: data.artists.hits
      .map(({ artist }) => artist)
      .map(convert.toArtistPreview),
  };
}

export async function fetchArtist(_id: string) {
  const contents = await Deno.readTextFile(`${RESPONSE_LOC}/artist.json`);

  const data: ShazamArtist = JSON.parse(contents);

  return convert.toArtist(data);
}

export async function fetchSong(_id: string) {
  const contents = await Deno.readTextFile(`${RESPONSE_LOC}/track.json`);

  const data: ShazamTrack = JSON.parse(contents);

  return convert.toTrack(data);
}
