// DO NOT EDIT. This file is generated by fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import config from "./deno.json" assert { type: "json" };
import * as $0 from "./routes/_app.tsx";
import * as $1 from "./routes/api/artists/[id].ts";
import * as $2 from "./routes/api/charts/countries/[id].ts";
import * as $3 from "./routes/api/charts/genres/[id].ts";
import * as $4 from "./routes/api/charts/index.ts";
import * as $5 from "./routes/api/search/[query].ts";
import * as $6 from "./routes/api/songs/[id].ts";
import * as $7 from "./routes/api/songs/related/[id].ts";
import * as $8 from "./routes/artists/[id].tsx";
import * as $9 from "./routes/discover/[genre].tsx";
import * as $10 from "./routes/index.tsx";
import * as $11 from "./routes/search/[query].tsx";
import * as $12 from "./routes/songs/[id].tsx";
import * as $13 from "./routes/top/artists.tsx";
import * as $14 from "./routes/top/songs.tsx";
import * as $$0 from "./islands/MusicRoutes.tsx";
import * as $$1 from "./islands/Navigation.tsx";
import * as $$2 from "./islands/SearchBar.tsx";
import * as $$3 from "./islands/SongPlayer.tsx";
import * as $$4 from "./islands/TopPreview.tsx";

const manifest = {
  routes: {
    "./routes/_app.tsx": $0,
    "./routes/api/artists/[id].ts": $1,
    "./routes/api/charts/countries/[id].ts": $2,
    "./routes/api/charts/genres/[id].ts": $3,
    "./routes/api/charts/index.ts": $4,
    "./routes/api/search/[query].ts": $5,
    "./routes/api/songs/[id].ts": $6,
    "./routes/api/songs/related/[id].ts": $7,
    "./routes/artists/[id].tsx": $8,
    "./routes/discover/[genre].tsx": $9,
    "./routes/index.tsx": $10,
    "./routes/search/[query].tsx": $11,
    "./routes/songs/[id].tsx": $12,
    "./routes/top/artists.tsx": $13,
    "./routes/top/songs.tsx": $14,
  },
  islands: {
    "./islands/MusicRoutes.tsx": $$0,
    "./islands/Navigation.tsx": $$1,
    "./islands/SearchBar.tsx": $$2,
    "./islands/SongPlayer.tsx": $$3,
    "./islands/TopPreview.tsx": $$4,
  },
  baseUrl: import.meta.url,
  config,
};

export default manifest;
