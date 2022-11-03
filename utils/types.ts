export type SearchResult = Readonly<{
  tracks: readonly Track[];
  artists: readonly ArtistPreview[];
}>;

export type Artist = Readonly<{
  id: string;
  genres: readonly string[];
  name: string;
  artwork: Artwork;
  topSongs: readonly ArtistSong[];
  songs: readonly ArtistSong[];
}>;

export type ArtistPreview = Readonly<{
  id: string;
  name: string;
  image?: string;
}>;

export type ArtistDescription = Readonly<{
  name: string;
  ids: readonly string[];
}>;

export type Artwork = Readonly<{
  url: string;
  colors: {
    text: readonly string[];
    background: string;
  };
}>;

export type ArtistSong = Readonly<{
  id: string;
  name: string;
  artist: ArtistDescription;
  genres: readonly string[];
  album: string;
  releaseDate: string;
  duration: number;
  artwork: Artwork;
  composer: string;
  data?: string;
}>;

export type Track = Readonly<{
  id: string;
  name: string;
  artist: ArtistDescription;
  genres?: readonly string[];
  images?: {
    background: string;
    cover: string;
  };
  data?: string;
  lyrics?: readonly string[];
}>;

export type Song = ArtistSong | Track;

export function toSize(src: string, size: number) {
  return src.replace(/({w})|({h})/g, size.toString());
}

export interface PreloadData {
  readonly [key: string]:
    | Artist
    | SearchResult
    | Track
    | readonly Track[]
    | undefined;
}
