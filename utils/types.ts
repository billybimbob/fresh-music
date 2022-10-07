// remote endpoint types

export interface ShazamTrack {
  readonly key: string;
  readonly title: string;
  readonly subtitle: string;
  readonly hub: {
    readonly actions?: readonly {
      readonly type: string;
      readonly id?: string;
      readonly uri?: string;
    }[];
  };
  readonly images?: {
    readonly background: string;
    readonly coverart: string;
  };
  readonly artists?: readonly { readonly adamid: string }[];
  readonly genres?: { [key: string]: string };
  readonly sections?: readonly { readonly text?: readonly string[] }[];
}

export interface ShazamArtistPreview {
  readonly avatar: string;
  readonly name: string;
  readonly verified: boolean;
  readonly adamid: string;
}

export interface ShazamSearch {
  readonly tracks: {
    readonly hits: readonly { track: ShazamTrack }[];
  };
  readonly artists: {
    readonly hits: readonly { artist: ShazamArtistPreview }[];
  };
}

export interface ShazamArtwork {
  readonly url: string;
  readonly textColor1: string;
  readonly textColor2: string;
  readonly textColor3: string;
  readonly textColor4: string;
  readonly bgColor: string;
}

export interface ShazamArtist {
  readonly artists: {
    readonly [id: string]: {
      readonly id: string;
      readonly attributes: {
        readonly genreNames: readonly string[];
        readonly name: string;
        readonly artwork: ShazamArtwork;
      };
      readonly views: {
        readonly "top-songs": {
          readonly data: readonly { id: string }[];
        };
      };
    };
  };
  readonly songs: {
    readonly [id: string]: {
      readonly id: string;
      readonly attributes: {
        readonly albumName: string;
        readonly genreNames: readonly string[];
        readonly releaseDate: string;
        readonly durationInMillis: number;
        readonly artwork: ShazamArtwork;
        readonly composerName: string;
        readonly artistName: string;
        readonly name: string;
        readonly previews: readonly { readonly url: string }[];
      };
    };
  };
  // TODO: include albums def
}

// local types

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
  readonly image: string;
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
  readonly artist: string;
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
  readonly artist: {
    readonly name: string;
    readonly ids: readonly string[];
  };
  readonly genres?: readonly string[];
  readonly images?: {
    readonly background: string;
    readonly cover: string;
  };
  readonly data?: string;
  readonly lyrics?: string;
}

export type Song = ArtistSong | Track;
