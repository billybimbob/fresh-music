import { type HandlerContext, Status } from "$fresh/server.ts";
import { type ShazamTrack, toTrack } from "@/utils/types.ts";
import requestShazam from "@/utils/shazam.ts";

export const handler = async (_req: Request, ctx: HandlerContext) => {
  const { id } = ctx.params;

  const params = new URLSearchParams({
    country_code: id,
  });

  const shazam = requestShazam("/charts/country", params);

  const response = await fetch(shazam);

  if (!response.ok) {
    return new Response(null, { status: Status.BadRequest });
  }

  const data: readonly ShazamTrack[] = await response.json();

  const tracks = data.map(toTrack);

  return Response.json(tracks);
};
