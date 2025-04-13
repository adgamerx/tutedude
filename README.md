# TuteDude Video Progress Tracker

A modern React application that uniquely tracks video viewing progress, ensuring only the parts of a video that have been actually watched count toward completion percentage.

## Features

- **Unique Progress Tracking**: Only counts unique sections of video that have been watched
- **Persistent Progress**: Automatically saves progress to localStorage
- **Smart Resume**: Returns users to their last viewing position
- **Skip Protection**: Prevents users from marking content as viewed if they skip ahead
- **Interactive UI**: Clean, responsive interface with intuitive video controls

## Live Demo

You can view a working demo of the application [here](#) (add your demo link if available)

## Technology Stack

- React 18 with TypeScript
- Vite for fast development and builds
- TailwindCSS for responsive UI
- Radix UI components for accessible design
- React Router for navigation
- React Query for data fetching

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/adgamerx/tutedude.git
cd tutedude
```

2. Install dependencies
```bash
npm install
# or
yarn
```

3. Start the development server
```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:8080`

### Building for Production

```bash
npm run build
# or
yarn build
```

The build artifacts will be stored in the `dist/` directory.

## Design Decisions

### Video Progress Tracking Logic

The application uses a sophisticated interval-based tracking system:

1. **Interval Recording**: When a user watches a video segment, the start and end times are recorded as an interval.
2. **Interval Merging**: If a user re-watches portions of the video, the system merges overlapping intervals to ensure only unique parts count.
3. **Progress Calculation**: The total watched time is calculated from the merged intervals and compared to the video duration.

### Reasons for This Approach

- **Accuracy**: More accurate than simple time-based tracking
- **Prevention of Cheating**: Users cannot simply skip to the end to mark a video as complete
- **Learning Effectiveness**: Ensures users actually watch all content

### Data Storage

- Progress data is stored in `localStorage` for persistence between sessions
- Each video has a unique identifier to track progress independently

### UI/UX Considerations

- Clean, minimalist design focused on content
- Informative feedback through toast notifications when progress is updated
- Visual progress indicators showing exactly which parts of the video have been watched
- Standard video controls familiar to users

## Technical Implementation Details

### Interval Tracking System

The core of the application's unique progress tracking lies in its interval-based approach. Here's how it works in detail:

#### Tracking Watched Intervals

1. **Play Detection**: The system uses React's `useRef` to maintain references to the video element and to track when playback starts.

2. **Interval Recording**:
   - When a user plays the video, the current time is recorded as the start of an interval
   - When the user pauses, the current time is recorded as the end of that interval
   - These start-end pairs form a `VideoInterval` object that represents a continuous watched segment

3. **Event Handling**:
   - The application attaches event listeners to the video element (`onPlay`, `onPause`, `onSeeking`, etc.)
   - Each event triggers specific logic to update the intervals appropriately
   - For example, when seeking occurs during playback, the current interval is closed and a new one begins

4. **Minimum Duration**:
   - To prevent micro-intervals from fragmenting the data, intervals shorter than 1 second are filtered out
   - This improves both performance and data quality

#### Merging Intervals Algorithm

The interval merging algorithm is crucial for accurately calculating unique progress:

1. **Sorting**: First, all recorded intervals are sorted by their start times
   ```typescript
   const sortedIntervals = [...intervals].sort((a, b) => a.start - b.start);
   ```

2. **Merging Process**:
   - Start with the first interval in the result array
   - For each subsequent interval, check if it overlaps with the most recently merged interval
   - If there's overlap (current.start ≤ lastMerged.end), extend the end time of the last merged interval if needed
   - If there's no overlap, add the current interval as a new entry in the result array

3. **Overlap Handling**:
   ```typescript
   if (current.start <= lastMerged.end) {
     // Extend the last merged interval if needed
     lastMerged.end = Math.max(lastMerged.end, current.end);
   } else {
     // Add non-overlapping interval to result
     result.push(current);
   }
   ```

4. **Result**: A clean list of non-overlapping intervals representing unique video segments watched

#### Calculating Total Watched Time

After merging the intervals, calculating the total unique time watched becomes straightforward:

```typescript
export function calculateTotalWatched(intervals: VideoInterval[]): number {
  return intervals.reduce((total, interval) => {
    return total + (interval.end - interval.start);
  }, 0);
}
```

This function simply sums the duration of each non-overlapping interval to get the total unique time watched.

### Challenges and Solutions

Several technical challenges were encountered during development:

1. **Handling Seek Operations**:
   - **Challenge**: When users seek within a video, it can create incomplete or invalid intervals
   - **Solution**: Implemented special handling for seek events that closes the current interval before the seek and starts a new one after
   - When a user skips forward more than 5 seconds, only the first 5 seconds are counted, preventing "cheating"

2. **Race Conditions in Event Handling**:
   - **Challenge**: Video events can fire in unpredictable orders, especially on slower devices
   - **Solution**: Used ref objects to maintain consistent state between events and implemented guards to ensure events are processed in a logical order

3. **Performance with Many Intervals**:
   - **Challenge**: For long videos, the number of intervals could grow very large
   - **Solution**: 
     - Implemented interval merging during recording, not just at calculation time
     - Filtered out intervals shorter than 1 second to reduce data size
     - Used efficient algorithms for interval merging (O(n log n) time complexity)

4. **LocalStorage Limitations**:
   - **Challenge**: LocalStorage has size limitations that could be exceeded with many videos
   - **Solution**: Each video stores only its own progress data with a unique key, and the data structure is kept minimal

5. **Visual Representation of Intervals**:
   - **Challenge**: Showing users exactly which parts of a video they've watched
   - **Solution**: Created a custom progress bar component that visually displays watched segments as green portions on the progress bar

These solutions ensure the application provides accurate progress tracking while maintaining good performance and user experience.

## Code Structure

The application follows a component-based architecture:

- **Components**: Reusable UI components like `VideoPlayer` and `ProgressBar`
- **Types**: TypeScript interfaces for video progress tracking
- **Utils**: Utility functions for interval calculations and progress management
- **Pages**: Main page components for different routes

## Future Enhancements

- Backend integration for server-side progress storage
- User authentication to track progress across devices
- Analytics dashboard for content creators
- Support for playlists and course sequences

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
