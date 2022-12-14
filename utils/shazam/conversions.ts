import type {
  Artist,
  ArtistPreview,
  ArtistSong,
  Artwork,
  Track,
} from "@/utils/types.ts";
import type {
  ShazamArtist,
  ShazamArtistPreview,
  ShazamArtwork,
  ShazamTrack,
} from "@/utils/shazam/types.ts";

export function toTrack(source: ShazamTrack): Track {
  return {
    id: source.key,
    name: source.title,
    artist: {
      name: source.subtitle,
      ids: source.artists?.map(({ adamid }) => adamid) ?? [],
    },
    genres: source.genres === undefined
      ? undefined
      : Object.values(source.genres),
    images: source.images === undefined ? undefined : {
      background: source.images.background,
      cover: source.images.coverart,
    },
    data: source.hub.actions?.find((a) => a.type === "uri")?.uri,
    lyrics: source.sections?.find(({ text }) => Boolean(text))?.text,
  };
}

export function toArtistPreview(source: ShazamArtistPreview): ArtistPreview {
  return {
    id: source.adamid,
    name: source.name,
    image: source.avatar,
  };
}

export function toArtist(source: ShazamArtist): Artist {
  const [artist] = Object.values(source.artists);

  const songs = Object
    .values(source.songs)
    .reduce(
      (ss, song) => ss.set(song.id, toArtistSong(song, artist)),
      new Map<string, ArtistSong>(),
    );

  const topSongs = artist.views["top-songs"].data
    .map(({ id }) => id)
    .filter((id) => songs.has(id))
    .map((id) => songs.get(id)!);

  return {
    id: artist.id,
    genres: artist.attributes.genreNames,
    name: artist.attributes.name,
    artwork: toArtwork(artist.attributes.artwork),
    topSongs,
    songs: [...songs.values()],
  };
}

function toArtwork(source: ShazamArtwork): Artwork {
  return {
    url: source.url,
    colors: {
      text: [
        source.textColor1,
        source.textColor2,
        source.textColor3,
        source.textColor4,
      ],
      background: source.bgColor,
    },
  };
}

function toArtistSong(
  source: ShazamArtist["songs"]["id"],
  artist: ShazamArtist["artists"]["id"],
): ArtistSong {
  const { id, attributes: attrs } = source;
  const { previews: [pre = undefined] } = attrs;
  return {
    id,
    album: attrs.albumName,
    genres: attrs.genreNames,
    releaseDate: attrs.releaseDate,
    duration: attrs.durationInMillis,
    artwork: toArtwork(attrs.artwork),
    composer: attrs.composerName,
    artist: {
      name: artist.attributes.name,
      ids: [artist.id],
    },
    name: attrs.name,
    data: pre?.url,
  };
}

export function toSize(src: string, size: number) {
  return src.replace(/({w})|({h})/g, size.toString());
}
