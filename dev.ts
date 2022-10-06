#!/usr/bin/env -S deno run -A --watch=static/,routes/

import dev from "$fresh/dev.ts";
import "$dotenv/load.ts";

await dev(import.meta.url, "./main.ts");
