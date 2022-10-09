import { type HandlerContext, Status } from "$fresh/server.ts";
import type { ShazamTrack } from "@/utils/types.ts";
import { toTrack } from "@/utils/conversions.ts";
import fetchShazam from "@/utils/shazam.ts";

export const handler = async (_req: Request, ctx: HandlerContext<never>) => {
  const { song } = ctx.params;

  const response = await fetchShazam("/tracks/related", { track_id: song });

  if (!response.ok) {
    return new Response(null, { status: Status.InternalServerError });
  }

  const source: readonly ShazamTrack[] = await response.json();

  const tracks = source.map(toTrack);

  return Response.json(tracks);
};
