import { type Handler, Status } from "$fresh/server.ts";
import { contentType } from "$media_types";
import { fetchRelatedSongs } from "@/utils/shazam/mod.ts";

export const handler: Handler<never> = async (_req, ctx) => {
  const { id } = ctx.params;
  const related = await fetchRelatedSongs(id);

  if (related === null) {
    return new Response(null, { status: Status.InternalServerError });
  }

  return Response.json(related, {
    headers: { "content-type": contentType(".json") },
  });
};
