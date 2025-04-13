
import React from "react";
import VideoPlayer from "@/components/VideoPlayer";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Unique Video Progress Tracker</h1>
          <p className="text-gray-600 mb-8">
            This system tracks only the unique parts of the video you watch. Skipping or re-watching
            the same content won't count toward your progress.
          </p>
          
          <VideoPlayer
            src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
            title="Sample Lecture: Big Buck Bunny"
            videoId="big-buck-bunny-1"
          />
          
          <div className="mt-10 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">How Your Progress Is Tracked</h2>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-green-100 text-green-800 p-2 rounded-full mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Only Unique Views Count</h3>
                  <p className="text-gray-600">If you've already watched seconds 0-20 and then watch 10-30, only the new part (21-30) adds to your progress.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-blue-100 text-blue-800 p-2 rounded-full mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Progress Is Saved</h3>
                  <p className="text-gray-600">Your viewing progress is saved automatically. When you return, you'll resume from where you left off.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-yellow-100 text-yellow-800 p-2 rounded-full mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">No Skipping Allowed</h3>
                  <p className="text-gray-600">If you skip ahead, the skipped portions won't count as watched until you actually view them.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
