export interface Song {
  animeName: string;
  englishName: string;
  hash: string;
  songName: string;
  timestamp: number;
  isFavorite: boolean;
  _key?: string;
  _isLive?: boolean;
}

export interface ToastItem {
  id: string;
  song: Song;
  addedAt: number;
}
