import { type Handler } from "$fresh/server.ts";
import { contentType } from "$media_types";
import { fetchRelatedSongs } from "@shazam";

export const handler: Handler<never> = async (_req, ctx) => {
  const { id } = ctx.params;
  const related = await fetchRelatedSongs(id) ?? [];

  return Response.json(related, {
    headers: { "content-type": contentType(".json") },
  });
};
