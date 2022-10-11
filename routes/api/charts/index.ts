import { type Handler, Status } from "$fresh/server.ts";
import { fetchWorldCharts } from "@/utils/shazam/mod.ts";

export const handler: Handler<never> = async (_req, _ctx) => {
  const charts = await fetchWorldCharts();

  if (charts === null) {
    return new Response(null, { status: Status.InternalServerError });
  }

  return Response.json(charts);
};
