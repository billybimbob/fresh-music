import { type HandlerContext, Status } from "$fresh/server.ts";
import fetchShazam from "@/utils/shazam.ts";
import { toTrack } from "@/utils/conversions.ts";

export const handler = async (_req: Request, ctx: HandlerContext<never>) => {
  const { id } = ctx.params;

  const response = await fetchShazam("/tracks/details", { track_id: id });

  if (!response.ok) {
    return new Response(null, { status: Status.InternalServerError });
  }

  const song = await response.json().then(toTrack);

  return Response.json(song);
};
