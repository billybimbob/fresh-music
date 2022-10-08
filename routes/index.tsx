import type { HandlerContext, PageProps } from "$fresh/server.ts";

import genres from "@/static/genres.json" assert { type: "json" };
import type { ShazamTrack, Track } from "@/utils/types.ts";

import MusicBrowser from "@/islands/MusicBrowser.tsx";
import Navigation from "@/islands/Navigation.tsx";
import SearchBar from "@/islands/SearchBar.tsx";

interface PreloadResult {
  charts?: readonly Track[];
  genre?: readonly Track[];
}

const [{ value: defaultGenre }] = genres;

export const handler = async (
  req: Request,
  ctx: HandlerContext<PreloadResult>,
) => {
  const { origin } = new URL(req.url);
  const fetchChart = fetch(`${origin}/api/charts`);
  const fetchGenre = fetch(`${origin}/api/charts/genre/${defaultGenre}`);

  const [charts, genre] = await Promise.all([
    fetchChart.then(getTracks),
    fetchGenre.then(getTracks),
  ]);

  return ctx.render({ charts, genre });
};

async function getTracks(response: Response) {
  if (response.ok) {
    return await response.json() as readonly Track[];
  } else {
    return undefined;
  }
}

export default function Home(props: PageProps<PreloadResult>) {
  const { charts, genre } = props.data;
  return (
    <main class="music-browser">
      <Navigation />
      <div class="browser-main">
        <SearchBar />
        <MusicBrowser charts={charts} genre={genre} />
      </div>
    </main>
  );
}
