# fresh music

[![Made with Fresh](https://fresh.deno.dev/fresh-badge-dark.svg)](https://fresh.deno.dev)

Fresh music is music streaming app modeled after
[Spotify](https://www.spotify.com/), while being deployed on the edge with
[Deno Deploy](https://deno.com/deploy). The overall design is a modified (and
improved) version of
[this music app](https://github.com/adrianhajdin/project_music_player).

## Performance

The website utilizes a mix of server-side rendering (SSR) and single-page app
(SPA) design in order to achieve both fast initial load times and high
interactivity.

Fresh is structured around islands architecture, which also helps contribute to
the faster load times. Islands architecture enables the JavaScript code to be
incrementally loaded (hydrated) on top of the base static html.

[Preact signals](https://preactjs.com/blog/introducing-signals) are also
incorporated to further boost performance. Using signals provides optimizations
to client-side rendering by reducing the amount of virtual DOM diffing, and can
even help _skip_ rerenders entirely.
