import React, { useEffect, useRef, useState } from "react";
import { VideoInterval, VideoProgress } from "@/types/video";
import {
  calculateProgressPercentage,
  loadProgress,
  saveProgress,
  updateProgress,
} from "@/utils/progressTracker";
import ProgressBar from "./ProgressBar";
import { Button } from "@/components/ui/button";
import { Play, Pause, SkipForward, SkipBack } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface VideoPlayerProps {
  src: string;
  title: string;
  videoId: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, title, videoId }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState<VideoProgress | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const { toast } = useToast();
  
  // Keep track of when playback started for the current interval
  const playStartTimeRef = useRef<number | null>(null);
  
  // Load progress on component mount
  useEffect(() => {
    if (videoRef.current) {
      const videoDuration = videoRef.current.duration || 0;
      const savedProgress = loadProgress(videoId, videoDuration);
      setProgress(savedProgress);
      
      // Set video to last position
      if (savedProgress.lastPosition > 0) {
        videoRef.current.currentTime = savedProgress.lastPosition;
        setCurrentTime(savedProgress.lastPosition);
        toast({
          title: "Welcome back!",
          description: `Resuming from ${Math.floor(savedProgress.lastPosition / 60)}:${String(
            Math.floor(savedProgress.lastPosition % 60)
          ).padStart(2, '0')}`,
        });
      }
    }
  }, [videoId, toast]);
  
  // Update duration when metadata loads
  const handleMetadataLoaded = () => {
    if (videoRef.current && videoRef.current.duration) {
      const videoDuration = videoRef.current.duration;
      setProgress(prev => prev ? 
        { ...prev, videoDuration } : 
        { intervals: [], totalWatched: 0, videoDuration, lastPosition: 0 }
      );
    }
  };
  
  // Handle play/pause events
  const handlePlay = () => {
    if (videoRef.current) {
      playStartTimeRef.current = videoRef.current.currentTime;
      setIsPlaying(true);
    }
  };
  
  const handlePause = () => {
    if (videoRef.current && playStartTimeRef.current !== null && progress) {
      const playEndTime = videoRef.current.currentTime;
      
      // Only record intervals that are at least 1 second long
      if (playEndTime - playStartTimeRef.current >= 1) {
        const newInterval: VideoInterval = {
          start: playStartTimeRef.current,
          end: playEndTime,
        };
        
        const updatedProgress = updateProgress(progress, newInterval);
        setProgress(updatedProgress);
        saveProgress(videoId, updatedProgress);
        
        // Show toast for significant progress
        const newPercentage = calculateProgressPercentage(updatedProgress);
        const oldPercentage = calculateProgressPercentage(progress);
        
        if (Math.floor(newPercentage / 10) > Math.floor(oldPercentage / 10)) {
          toast({
            title: "Progress updated!",
            description: `You've watched ${newPercentage}% of this video.`,
          });
        }
      }
      
      playStartTimeRef.current = null;
      setIsPlaying(false);
    }
  };
  
  // Track seeking events to prevent skipping
  const handleSeeking = () => {
    if (videoRef.current && isPlaying && playStartTimeRef.current !== null && progress) {
      const seekTime = videoRef.current.currentTime;
      
      // If seeking forward more than 5 seconds, record the interval before the seek
      if (seekTime > playStartTimeRef.current + 5) {
        const newInterval: VideoInterval = {
          start: playStartTimeRef.current,
          end: playStartTimeRef.current + 5, // Only count up to 5 seconds of skipping
        };
        
        const updatedProgress = updateProgress(progress, newInterval);
        setProgress(updatedProgress);
        saveProgress(videoId, updatedProgress);
      }
      
      // Update play start time to current position after seeking
      playStartTimeRef.current = seekTime;
    }
  };
  
  // Handle time updates to show current position
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };
  
  // Handle video end
  const handleEnded = () => {
    if (progress && playStartTimeRef.current !== null) {
      const newInterval: VideoInterval = {
        start: playStartTimeRef.current,
        end: progress.videoDuration,
      };
      
      const updatedProgress = updateProgress(progress, newInterval);
      setProgress(updatedProgress);
      saveProgress(videoId, updatedProgress);
      playStartTimeRef.current = null;
      setIsPlaying(false);
      
      toast({
        title: "Video completed!",
        description: `You've watched ${calculateProgressPercentage(updatedProgress)}% of this video.`,
      });
    }
  };
  
  // Toggle play/pause
  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };
  
  // Skip forward/backward
  const skip = (seconds: number) => {
    if (videoRef.current) {
      // Handle the current interval before skipping
      if (isPlaying && playStartTimeRef.current !== null && progress) {
        const newInterval: VideoInterval = {
          start: playStartTimeRef.current,
          end: videoRef.current.currentTime,
        };
        
        const updatedProgress = updateProgress(progress, newInterval);
        setProgress(updatedProgress);
        saveProgress(videoId, updatedProgress);
      }
      
      // Skip to new position
      videoRef.current.currentTime += seconds;
      if (isPlaying) {
        playStartTimeRef.current = videoRef.current.currentTime;
      }
    }
  };
  
  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 bg-gray-50 border-b">
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
      
      <div className="relative">
        <video
          ref={videoRef}
          className="w-full aspect-video"
          onPlay={handlePlay}
          onPause={handlePause}
          onSeeking={handleSeeking}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
          onLoadedMetadata={handleMetadataLoaded}
        >
          <source src={src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          {progress && (
            <ProgressBar
              intervals={progress.intervals}
              duration={progress.videoDuration}
              percentage={calculateProgressPercentage(progress)}
              className="mb-2"
            />
          )}
        </div>
      </div>
      
      <div className="p-4 flex items-center space-x-4">
        <Button variant="outline" size="icon" onClick={() => skip(-10)}>
          <SkipBack size={16} />
        </Button>
        
        <Button 
          variant="default" 
          size="icon" 
          className="h-12 w-12 rounded-full"
          onClick={togglePlayPause}
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-1" />}
        </Button>
        
        <Button variant="outline" size="icon" onClick={() => skip(10)}>
          <SkipForward size={16} />
        </Button>
        
        <div className="text-sm text-gray-500 ml-2">
          {Math.floor(currentTime / 60)}:{String(Math.floor(currentTime % 60)).padStart(2, '0')}
          {progress && (
            <> / {Math.floor(progress.videoDuration / 60)}:{String(Math.floor(progress.videoDuration % 60)).padStart(2, '0')}</>
          )}
        </div>
      </div>
      
      <div className="p-4 bg-gray-50 border-t">
        {progress && (
          <div className="text-sm">
            <p className="font-medium">Your unique progress: {calculateProgressPercentage(progress)}%</p>
            <p className="text-gray-500 mt-1">
              You've watched {Math.floor(progress.totalWatched / 60)}:{String(Math.floor(progress.totalWatched % 60)).padStart(2, '0')} 
              of unique video content
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;
