# fresh music

[![Made with Fresh](https://fresh.deno.dev/fresh-badge-dark.svg)](https://fresh.deno.dev)

Fresh music is an online music player modeled after
[Spotify](https://www.spotify.com/), while being deployed on the edge with
[Deno Deploy](https://deno.com/deploy). The overall design is a modified (and
improved) version of
[this music app](https://github.com/adrianhajdin/project_music_player).

## Performance

The website utilizes a mix of both server-side rendering (SSR) and also
single-page app (SPA) design in order to achieve both fast initial load times as
well as high interactivity.

Fresh also uses islands architecture, which also leads to faster load times, as
the JavaScript can be incrementally loaded (hydrated) on top of the base static
html page.

[Preact signals](https://preactjs.com/blog/introducing-signals) are also
incorporated to further boost performance. Using signals provides optimizations
to client-side rendering by reducing the amount of virtual DOM diffing, and can
even help _skip_ rerenders entirely.
