export interface ParsedToken {
  type: 'element' | 'text' | 'space';
  symbol?: string;
  name?: string;
  number?: number;
  value?: string;
}

export interface LyricLine {
  timestamp: number;
  originalLine: string;
  parsedTokens: ParsedToken[];
}

export interface Song {
  id: string;
  _id: string; // MongoDB ID
  title: string;
  artist: string;
  coverColor: string;
  duration: number;
  audioUrl: string;
  coverUrl?: string;
  lyrics: LyricLine[];
  createdAt?: string;
  updatedAt?: string;
}
