import { type HandlerContext, Status } from "$fresh/server.ts";
import type { ShazamTrack } from "@/utils/types.ts";
import { toTrack } from "@/utils/conversions.ts";
import fetchShazam from "@/utils/shazam.ts";

export const handler = async (_req: Request, ctx: HandlerContext) => {
  const { id } = ctx.params;

  const response = await fetchShazam("/charts/genre-world", {
    genre_code: id,
  });

  if (!response.ok) {
    return new Response(null, { status: Status.BadRequest });
  }

  const data: readonly ShazamTrack[] = await response.json();

  const tracks = data.map(toTrack);

  return Response.json(tracks);
};
