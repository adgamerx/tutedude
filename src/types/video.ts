
export interface VideoInterval {
  start: number;
  end: number;
}

export interface VideoProgress {
  intervals: VideoInterval[];
  totalWatched: number;
  videoDuration: number;
  lastPosition: number;
}
