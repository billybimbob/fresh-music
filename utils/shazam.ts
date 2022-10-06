import { IS_BROWSER } from "$fresh/runtime.ts";
import { Status } from "$fresh/server.ts";

const baseUrl = "https://shazam-core.p.rapidapi.com/v1/";

const shazamKey = Deno.env.get("SHAZAM_KEY");

export default function getRequest(
  endpoint: string,
  params?: Record<string, string>,
) {
  if (IS_BROWSER) {
    return Promise.resolve(
      new Response(null, {
        status: Status.BadRequest,
        statusText: "Cannot request from the browser",
      }),
    );
  }

  if (shazamKey === undefined) {
    return Promise.resolve(
      new Response(null, {
        status: Status.BadRequest,
        statusText: "Api key cannot be found",
      }),
    );
  }

  const url = new URL(endpoint, baseUrl);

  if (params !== undefined) {
    for (const [name, value] of Object.entries(params)) {
      url.searchParams.set(name, value);
    }
  }

  const request = new Request(url, {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": shazamKey,
    },
  });

  return fetch(request);
}
