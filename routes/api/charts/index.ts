import { type HandlerContext, Status } from "$fresh/server.ts";
import type { ShazamTrack } from "@/utils/types.ts";
import { toTrack } from "@/utils/conversions.ts";
import fetchShazam from "@/utils/shazam.ts";

export const handler = async (_req: Request, _ctx: HandlerContext<never>) => {
  const response = await fetchShazam("/charts/world");

  if (!response.ok) {
    return new Response(null, { status: Status.InternalServerError });
  }

  const data: readonly ShazamTrack[] = await response.json();

  const tracks = data.map(toTrack);

  return Response.json(tracks);
};
