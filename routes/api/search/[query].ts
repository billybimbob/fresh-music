import { type HandlerContext, Status } from "$fresh/server.ts";
import type { ShazamSearch } from "@/utils/types.ts";
import { toArtistPreview, toTrack } from "@/utils/conversions.ts";
import fetchShazam from "@/utils/shazam.ts";

export const handler = async (_req: Request, ctx: HandlerContext<never>) => {
  const { query } = ctx.params;

  const response = await fetchShazam("/search/multi", {
    search_type: "SONGS_ARTISTS",
    query,
  });

  if (!response.ok) {
    return new Response(null, { status: Status.InternalServerError });
  }

  const search: ShazamSearch = await response.json();

  const result = {
    tracks: search.tracks.hits.map(({ track }) => toTrack(track)),
    artists: search.artists.hits.map(({ artist }) => toArtistPreview(artist)),
  };

  return Response.json(result);
};
