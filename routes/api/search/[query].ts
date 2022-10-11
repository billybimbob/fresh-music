import { type Handler, Status } from "$fresh/server.ts";
import { fetchSearch } from "@/utils/shazam/mod.ts";

export const handler: Handler<never> = async (_req, ctx) => {
  const { query } = ctx.params;
  const result = await fetchSearch(query);

  if (result === null) {
    return new Response(null, { status: Status.InternalServerError });
  }

  return Response.json(result);
};
