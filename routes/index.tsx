import type { HandlerContext, PageProps } from "$fresh/server.ts";
import { fetchPreload, type PreloadResult } from "@/utils/preload.ts";

import MusicRoutes from "@/islands/MusicRoutes.tsx";
import Navigation from "@/islands/Navigation.tsx";
import SearchBar from "@/islands/SearchBar.tsx";
import SongPlayer from "@/islands/SongPlayer.tsx";
import TopPreview from "@/islands/TopPreview.tsx";

export const handler = async (
  _req: Request,
  ctx: HandlerContext<PreloadResult>,
) => {
  const preload = await fetchPreload();
  return ctx.render(preload);
};

export default function Home({ data }: PageProps<PreloadResult>) {
  const { charts, genre } = data;
  return (
    <main class="music-browser">
      <Navigation />
      <div class="browser-main">
        <SearchBar />
        <div class="browser-inner">
          <MusicRoutes charts={charts} genre={genre} />
          <TopPreview />
        </div>
      </div>
      <SongPlayer />
    </main>
  );
}
