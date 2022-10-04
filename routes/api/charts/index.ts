import { type HandlerContext, Status } from "$fresh/server.ts";
import type { ShazamTrack } from "@/utils/types.ts";
import { toTrack } from "@/utils/conversions.ts";
import requestShazam from "@/utils/shazam.ts";

export const handler = async (_req: Request, _ctx: HandlerContext) => {
  const shazam = requestShazam("/charts/world");

  const response = await fetch(shazam);

  if (!response.ok) {
    return new Response(null, { status: Status.BadRequest });
  }

  const data: readonly ShazamTrack[] = await response.json();

  const tracks = data.map(toTrack);

  return Response.json(tracks);
};
