import { type HandlerContext, Status } from "$fresh/server.ts";
import { toArtist } from "@/utils/conversions.ts";
import fetchShazam from "@/utils/shazam.ts";

export const handler = async (_req: Request, ctx: HandlerContext<never>) => {
  const { id } = ctx.params;

  const response = await fetchShazam("/artists/details", { artist_id: id });

  if (!response.ok) {
    return new Response(null, { status: Status.InternalServerError });
  }

  const artist = await response.json().then(toArtist);

  return Response.json(artist);
};
