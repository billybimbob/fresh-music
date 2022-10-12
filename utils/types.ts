export interface SearchResult {
  readonly tracks: readonly Track[];
  readonly artists: readonly ArtistPreview[];
}

export interface Artist {
  readonly id: string;
  readonly genres: readonly string[];
  readonly name: string;
  readonly artwork: Artwork;
  readonly topSongs: readonly ArtistSong[];
  readonly songs: readonly ArtistSong[];
}

export interface ArtistPreview {
  readonly id: string;
  readonly name: string;
  readonly image?: string;
}

export interface ArtistDescription {
  readonly name: string;
  readonly ids: readonly string[];
}

export interface Artwork {
  readonly url: string;
  readonly colors: {
    readonly text: readonly string[];
    readonly background: string;
  };
}

export interface ArtistSong {
  readonly id: string;
  readonly name: string;
  readonly artist: ArtistDescription;
  readonly genres: readonly string[];
  readonly album: string;
  readonly releaseDate: string;
  readonly duration: number;
  readonly artwork: Artwork;
  readonly composer: string;
  readonly data?: string;
}

export interface Track {
  readonly id: string;
  readonly name: string;
  readonly artist: ArtistDescription;
  readonly genres?: readonly string[];
  readonly images?: {
    readonly background: string;
    readonly cover: string;
  };
  readonly data?: string;
  readonly lyrics?: string;
}

export type Song = ArtistSong | Track;

export function toSize(src: string, size: number) {
  return src.replace(/({w})|({h})/g, size.toString());
}
