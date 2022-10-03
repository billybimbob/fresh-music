import { type HandlerContext, Status } from "$fresh/server.ts";
import { type ShazamCharts } from "@/utils/types.ts";
import requestShazam from "@/utils/shazam.ts";

export const handler = async (_req: Request, _ctx: HandlerContext) => {
  const shazam = requestShazam("/charts/world");

  const response = await fetch(shazam);

  if (!response.ok) {
    return new Response(null, { status: Status.BadRequest });
  }

  const charts: ShazamCharts = await response.json();

  // TODO: parse charts results

  return Response.json(charts);
};
