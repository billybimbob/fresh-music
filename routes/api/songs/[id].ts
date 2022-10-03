import { type HandlerContext, Status } from "$fresh/server.ts";
import requestShazam from "@/utils/shazam.ts";
import { toTrack } from "@/utils/types.ts";

export const handler = async (_req: Request, ctx: HandlerContext) => {
  const { id } = ctx.params;

  const params = new URLSearchParams({ track_id: id });

  const shazam = requestShazam("/tracks/details", params);

  const response = await fetch(shazam);

  if (!response.ok) {
    return new Response(null, { status: Status.BadRequest });
  }

  const song = await response.json().then(toTrack);

  return Response.json(song);
};
