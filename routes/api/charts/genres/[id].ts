import { type Handler, Status } from "$fresh/server.ts";
import { fetchGenreCharts } from "@/utils/shazam/mod.ts";

export const handler: Handler<never> = async (_req, ctx) => {
  const { id } = ctx.params;
  const charts = await fetchGenreCharts(id);

  if (charts === null) {
    return new Response(null, { status: Status.InternalServerError });
  }

  return Response.json(charts);
};
