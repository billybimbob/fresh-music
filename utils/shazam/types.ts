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
  readonly sections?: readonly {
    readonly type: string;
    readonly text?: readonly string[];
  }[];
}

export interface ShazamArtistPreview {
  readonly avatar?: string;
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
