import { type HandlerContext, Status } from "$fresh/server.ts";
import type { ShazamTrack } from "@/utils/types.ts";
import { toTrack } from "@/utils/conversions.ts";
import requestShazam from "@/utils/shazam.ts";

export const handler = async (_req: Request, ctx: HandlerContext) => {
  const { song } = ctx.params;

  const params = new URLSearchParams({
    track_id: song,
  });

  const shazam = requestShazam("/tracks/related", params);

  const response = await fetch(shazam);

  if (!response.ok) {
    return new Response(null, { status: Status.BadRequest });
  }

  const data: { tracks: readonly ShazamTrack[] } = await response.json();

  const tracks = data.tracks.map(toTrack);

  return Response.json(tracks);
};
