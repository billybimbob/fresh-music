export interface ShazamTrack {
  key: string;
  title: string;
  subtitle: string;
  hub: {
    actions?: {
      type: string;
      id?: string;
      uri?: string;
    }[];
  };
  images?: {
    background: string;
    coverart: string;
  };
  artists?: { adamid: string }[];
  genres?: { [key: string]: string };
  sections?: {
    type: string;
    text?: string[];
  }[];
}

export interface ShazamArtistPreview {
  avatar?: string;
  name: string;
  verified: boolean;
  adamid: string;
}

export interface ShazamSearch {
  tracks: {
    hits: { track: ShazamTrack }[];
  };
  artists: {
    hits: { artist: ShazamArtistPreview }[];
  };
}

export interface ShazamArtwork {
  url: string;
  textColor1: string;
  textColor2: string;
  textColor3: string;
  textColor4: string;
  bgColor: string;
}

export interface ShazamArtist {
  artists: {
    [id: string]: {
      id: string;
      attributes: {
        genreNames: string[];
        name: string;
        artwork: ShazamArtwork;
      };
      views: {
        "top-songs": {
          data: { id: string }[];
        };
      };
    };
  };
  songs: {
    [id: string]: {
      id: string;
      attributes: {
        albumName: string;
        genreNames: string[];
        releaseDate: string;
        durationInMillis: number;
        artwork: ShazamArtwork;
        composerName: string;
        artistName: string;
        name: string;
        previews: { url: string }[];
      };
    };
  };
  // TODO: include albums def
}
