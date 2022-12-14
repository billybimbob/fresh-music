import { type Handler, Status } from "$fresh/server.ts";
import { contentType } from "$media_types";
import { fetchCountryCharts } from "@shazam";

export const handler: Handler<never> = async (_req, ctx) => {
  const { id } = ctx.params;
  const charts = await fetchCountryCharts(id);

  if (charts === null) {
    return new Response(null, { status: Status.NotFound });
  }

  return Response.json(charts, {
    headers: { "content-type": contentType(".json") },
  });
};
