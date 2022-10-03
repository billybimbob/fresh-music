import { type HandlerContext, Status } from "$fresh/server.ts";
import { toArtist } from "@/utils/types.ts";
import requestShazam from "@/utils/shazam.ts";

export const handler = async (_req: Request, ctx: HandlerContext) => {
  const { id } = ctx.params;

  const params = new URLSearchParams({ artist_id: id });

  const shazam = requestShazam("/artists/details", params);

  const response = await fetch(shazam);

  if (!response.ok) {
    return new Response(null, { status: Status.BadRequest });
  }

  const artist = await response.json().then(toArtist);

  return Response.json(artist);
};
