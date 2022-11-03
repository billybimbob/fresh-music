import { Status } from "$fresh/server.ts";
import { IS_BROWSER } from "$fresh/runtime.ts";
import genres from "@/static/genres.json" assert { type: "json" };
import * as convert from "@/utils/shazam/conversions.ts";
import type {
  ShazamArtist,
  ShazamSearch,
  ShazamTrack,
} from "@/utils/shazam/types.ts";

const [{ value: defaultGenre }] = genres;

export async function fetchGenreCharts(id?: string) {
  const response = await fetchShazam("v1/charts/genre-world", {
    genre_code: id ?? defaultGenre,
  });

  if (!response.ok) {
    console.error(await response.text());
    return null;
  }

  const data: readonly ShazamTrack[] = await response.json();

  return data.map(convert.toTrack);
}

export async function fetchCountryCharts(id: string) {
  const response = await fetchShazam("v1/charts/country", {
    country_code: id,
  });

  if (!response.ok) {
    console.error(await response.text());
    return null;
  }

  const data: readonly ShazamTrack[] = await response.json();

  return data.map(convert.toTrack);
}

export async function fetchWorldCharts() {
  const response = await fetchShazam("v1/charts/world");

  if (!response.ok) {
    console.error(await response.text());
    return null;
  }

  const data: readonly ShazamTrack[] = await response.json();

  return data.map(convert.toTrack);
}

export async function fetchSearch(query: string) {
  const response = await fetchShazam("v1/search/multi", {
    search_type: "SONGS_ARTISTS",
    query,
  });

  if (!response.ok) {
    console.error(await response.text());
    return null;
  }

  const data: ShazamSearch = await response.json();

  return {
    tracks: data.tracks.hits
      .map(({ track }) => track)
      .map(convert.toTrack),

    artists: data.artists.hits
      .map(({ artist }) => artist)
      .map(convert.toArtistPreview),
  };
}

export async function fetchRelatedSongs(id: string) {
  const response = await fetchShazam("v1/tracks/related", { track_id: id });

  if (!response.ok) {
    console.error(await response.text());
    return null;
  }

  const data: readonly ShazamTrack[] = await response.json();

  return data.map(convert.toTrack);
}

export async function fetchSong(id: string) {
  const response = await fetchShazam("v1/tracks/details", { track_id: id });

  if (!response.ok) {
    console.error(await response.text());
    return null;
  }

  const data: ShazamTrack = await response.json();

  return convert.toTrack(data);
}

export async function fetchArtist(id: string) {
  const response = await fetchShazam("v1/artists/details", { artist_id: id });

  if (!response.ok) {
    console.error(await response.text());
    return null;
  }

  const data: ShazamArtist = await response.json();

  return convert.toArtist(data);
}

const baseUrl = "https://shazam-core.p.rapidapi.com/";

const shazamKey = Deno.env.get("SHAZAM_KEY");

async function fetchShazam(endpoint: string, params?: Record<string, string>) {
  if (IS_BROWSER) {
    return new Response("Cannot request from the browser", {
      status: Status.Unauthorized,
    });
  }

  if (shazamKey === undefined) {
    return new Response("Api key cannot be found", {
      status: Status.BadRequest,
    });
  }

  const url = new URL(endpoint, baseUrl);

  if (params) {
    for (const [name, value] of Object.entries(params)) {
      url.searchParams.set(name, value);
    }
  }

  return await fetch(url, {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": shazamKey,
      "X-RapidAPI-Host": "shazam-core.p.rapidapi.com",
    },
  });
}
