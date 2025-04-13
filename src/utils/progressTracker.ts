
import { VideoInterval, VideoProgress } from "@/types/video";

/**
 * Merges overlapping intervals and calculates total unique time watched
 */
export function mergeIntervals(intervals: VideoInterval[]): VideoInterval[] {
  if (intervals.length <= 1) return intervals;
  
  // Sort intervals by start time
  const sortedIntervals = [...intervals].sort((a, b) => a.start - b.start);
  const result: VideoInterval[] = [sortedIntervals[0]];
  
  for (let i = 1; i < sortedIntervals.length; i++) {
    const current = sortedIntervals[i];
    const lastMerged = result[result.length - 1];
    
    // If current interval overlaps with last merged interval
    if (current.start <= lastMerged.end) {
      // Extend the last merged interval if needed
      lastMerged.end = Math.max(lastMerged.end, current.end);
    } else {
      // Add non-overlapping interval to result
      result.push(current);
    }
  }
  
  return result;
}

/**
 * Calculates total unique seconds watched from merged intervals
 */
export function calculateTotalWatched(intervals: VideoInterval[]): number {
  return intervals.reduce((total, interval) => {
    return total + (interval.end - interval.start);
  }, 0);
}

/**
 * Updates progress with a new watched interval
 */
export function updateProgress(
  progress: VideoProgress,
  newInterval: VideoInterval
): VideoProgress {
  const updatedIntervals = mergeIntervals([...progress.intervals, newInterval]);
  const totalWatched = calculateTotalWatched(updatedIntervals);
  
  return {
    intervals: updatedIntervals,
    totalWatched,
    videoDuration: progress.videoDuration,
    lastPosition: newInterval.end,
  };
}

/**
 * Calculates progress percentage
 */
export function calculateProgressPercentage(progress: VideoProgress): number {
  if (progress.videoDuration === 0) return 0;
  return Math.min(100, Math.round((progress.totalWatched / progress.videoDuration) * 100));
}

/**
 * Saves progress to localStorage
 */
export function saveProgress(videoId: string, progress: VideoProgress): void {
  localStorage.setItem(`video-progress-${videoId}`, JSON.stringify(progress));
}

/**
 * Loads progress from localStorage
 */
export function loadProgress(videoId: string, videoDuration: number): VideoProgress {
  const savedProgress = localStorage.getItem(`video-progress-${videoId}`);
  
  if (savedProgress) {
    return JSON.parse(savedProgress) as VideoProgress;
  }
  
  return {
    intervals: [],
    totalWatched: 0,
    videoDuration,
    lastPosition: 0,
  };
}
