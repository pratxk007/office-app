import { createContext } from "react";

// Define the shape of the video data
export type VideoData = {
  videoScript: string[];  
  captions: string[];
  audioFile: string;
  images: string[];
};

// Define the context type
interface VideoDataContextType {
  videoData: VideoData | null;  
  setVideoData: React.Dispatch<React.SetStateAction<VideoData | null>>; 
}

// Provide a default value for the context
export const VideoDataContext = createContext<VideoDataContextType | undefined>(undefined);
