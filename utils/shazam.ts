import { IS_BROWSER } from "$fresh/runtime.ts";

const baseUrl = "https://shazam-core.p.rapidapi.com/v1/";

const shazamKey = Deno.env.get("SHAZAM_KEY");

if (IS_BROWSER || shazamKey === undefined) {
  throw new Error("API key must be set");
}

export default function getRequest(endpoint: string, params?: URLSearchParams) {
  const url = new URL(endpoint, baseUrl);

  params?.forEach((name, value) => url.searchParams.set(name, value));

  return new Request(url, {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": shazamKey!,
    },
  });
}
