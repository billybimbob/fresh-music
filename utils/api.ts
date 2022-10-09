import type { Handler, HandlerContext } from "$fresh/server.ts";
import type { Artist, SearchResult, Track } from "@/utils/types.ts";
import genres from "@/static/genres.json" assert { type: "json" };

const [{ value: defaultGenre }] = genres;

export default Object.freeze({
  charts: "/api/charts",
  defaultGenre: `/api/charts/genres/${defaultGenre}`,
  artist: (id: string) => `/api/songs/artists/${id}`,
  genreCharts: (id: string) => `/api/charts/genres/${id}`,
  related: (song: string) => `/api/search/related/${song}`,
  search: (query: string) => `/api/search/${query}`,
  song: (id: string) => `/api/songs/${id}`,
});

export async function fetchGenreCharts<Source>(
  req: Request,
  ctx: HandlerContext<Source>,
  id?: string,
) {
  const { handler } = await import("@/routes/api/charts/genres/[id].ts");

  const response = await invokeApi(handler, {
    req,
    ctx,
    params: { id: id ?? defaultGenre },
  });

  return toTracks(response);
}

export async function fetchCharts<Source>(
  req: Request,
  ctx: HandlerContext<Source>,
) {
  const { handler } = await import("@/routes/api/charts/index.ts");

  const response = await invokeApi(handler, { req, ctx });

  return toTracks(response);
}

export async function fetchSearch<Source>(
  req: Request,
  ctx: HandlerContext<Source>,
  query: string,
) {
  const { handler } = await import("@/routes/api/search/[query].ts");

  const response = await invokeApi(handler, {
    req,
    ctx,
    params: { query },
  });

  return toSearch(response);
}

export async function fetchArtist<Source>(
  req: Request,
  ctx: HandlerContext<Source>,
  id: string,
) {
  const { handler } = await import("@/routes/api/songs/artists/[id].ts");

  const response = await invokeApi(handler, { req, ctx, params: { id } });

  return toArtist(response);
}

export async function fetchSong<Source>(
  req: Request,
  ctx: HandlerContext<Source>,
  id: string,
) {
  const { handler } = await import("@/routes/api/songs/[id].ts");

  const response = await invokeApi(handler, { req, ctx, params: { id } });

  return toTrack(response);
}

export async function fetchRelated<Source>(
  req: Request,
  ctx: HandlerContext<Source>,
  song: string,
) {
  const { handler } = await import("@/routes/api/search/related/[song].ts");

  const response = await invokeApi(handler, {
    req,
    ctx,
    params: { song },
  });

  return toTracks(response);
}

// TODO: account for state types

interface SourceContext<Data> {
  readonly req: Request;
  readonly ctx: HandlerContext<Data>;
  readonly params?: Record<string, string>;
}

async function invokeApi<Source>(
  apiHandler: Handler<never>,
  source: SourceContext<Source>,
) {
  const params = source.params ?? {};

  const apiCall = apiHandler(source.req, { ...source.ctx, params });

  if (apiCall instanceof Promise) {
    return await apiCall;
  }

  return apiCall;
}

async function toTrack(response: Response) {
  if (response.ok) {
    return await response.json() as Track;
  } else {
    return undefined;
  }
}

async function toTracks(response: Response) {
  if (response.ok) {
    return await response.json() as readonly Track[];
  } else {
    return undefined;
  }
}

async function toArtist(response: Response) {
  if (response.ok) {
    return await response.json() as Artist;
  } else {
    return undefined;
  }
}

async function toSearch(response: Response) {
  if (response.ok) {
    return await response.json() as SearchResult;
  } else {
    return undefined;
  }
}
