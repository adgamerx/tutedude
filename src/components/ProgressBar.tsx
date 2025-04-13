
import React from "react";
import { VideoInterval } from "@/types/video";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  intervals: VideoInterval[];
  duration: number;
  className?: string;
  percentage: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  intervals,
  duration,
  className,
  percentage,
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      <div className="flex justify-between text-sm text-gray-500">
        <span>Progress: {percentage}%</span>
        <span>{Math.floor(duration / 60)}:{String(Math.floor(duration % 60)).padStart(2, '0')}</span>
      </div>
      
      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden relative">
        {intervals.map((interval, index) => {
          const startPercent = (interval.start / duration) * 100;
          const widthPercent = ((interval.end - interval.start) / duration) * 100;
          
          return (
            <div
              key={index}
              className="h-full bg-green-500 absolute"
              style={{
                left: `${startPercent}%`,
                width: `${widthPercent}%`,
                maxWidth: '100%', // Prevent overflow beyond container
              }}
            />
          );
        })}
      </div>
      
      <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500 transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
