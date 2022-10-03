import { type HandlerContext, Status } from "$fresh/server.ts";
import { type ShazamSearch, toTrack } from "@/utils/types.ts";
import requestShazam from "@/utils/shazam.ts";

export const handler = async (_req: Request, ctx: HandlerContext) => {
  const { query } = ctx.params;

  const params = new URLSearchParams({
    search_type: "SONGS_ARTISTS",
    query,
  });

  const shazam = requestShazam("/search/multi", params);

  const response = await fetch(shazam);

  if (!response.ok) {
    return new Response(null, { status: Status.BadRequest });
  }

  const search: ShazamSearch = await response.json();

  const hits = {
    tracks: search.tracks.hits.map(({ track }) => toTrack(track)),
    artists: search.artists.hits.map(({ artist }) => artist),
  } as const;

  return Response.json(hits);
};
