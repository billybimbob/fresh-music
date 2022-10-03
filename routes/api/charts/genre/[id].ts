import { type HandlerContext, Status } from "$fresh/server.ts";
import { type ShazamTrack, toTrack } from "@/utils/types.ts";
import requestShazam from "@/utils/shazam.ts";

export const handler = async (_req: Request, ctx: HandlerContext) => {
  const { id } = ctx.params;

  const params = new URLSearchParams({
    genre_code: id,
  });

  const shazam = requestShazam("/charts/genre-world", params);

  const response = await fetch(shazam);

  if (!response.ok) {
    return new Response(null, { status: Status.BadRequest });
  }

  const data: { tracks: readonly ShazamTrack[] } = await response.json();

  const tracks = data.tracks.map(toTrack);

  return Response.json(tracks);
};
