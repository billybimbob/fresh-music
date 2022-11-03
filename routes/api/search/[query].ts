import { type Handler } from "$fresh/server.ts";
import { contentType } from "$media_types";
import { fetchSearch } from "@shazam";

export const handler: Handler<never> = async (_req, ctx) => {
  const { query } = ctx.params;
  const result = await fetchSearch(query) ?? [];

  return Response.json(result, {
    headers: { "content-type": contentType(".json") },
  });
};
