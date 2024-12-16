/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Player } from "@remotion/player";
import RemotionVideo from "./RemotionVideo";
import { Button } from "@/components/ui/button";
import { db } from "@/configs/db";
import { VideoData } from "@/configs/schema";
import { eq } from "drizzle-orm";

interface Props {
  playVideo: boolean;
  videoId: number;
}

interface VideoDataProps {
  id: number;
  script: string;
  audioFileUrl: string;
  captions: Array<{ start: number; end: number; text: string }>;
  imageList: string[];
  createdBy: string;
}

function PlayerDialog({ playVideo, videoId }: Props) {
  const [openDialog, setOpenDialog] = useState(false);
  const [videoData, setVideoData] = useState<VideoDataProps | null>(null);
  const [durationInFrame, setDurationInFrame] = useState(100);

  useEffect(() => {
    setOpenDialog(playVideo);
    if (videoId) {
      getVideoData();
    }
  }, [playVideo, videoId]);

  const getVideoData = async () => {
    const result = await db
      .select()
      .from(VideoData)
      .where(eq(VideoData.id, videoId));

    if (result.length > 0) {
      setVideoData(result[0]);
    }
  };

  if (!videoData) {
    // If videoData is not loaded, don't render the Player
    return null;
  }
  console.log(durationInFrame);

  return (
    <>
      <Dialog open={openDialog}>
        <DialogContent className="bg-white flex flex-col items-center">
          <DialogHeader>
            <DialogTitle className="my-5 text-3xl font-bold">
              Your video is ready
            </DialogTitle>
            <DialogDescription>
              <Player
                component={RemotionVideo}
                durationInFrames={Math.round(durationInFrame)} // Ensure it uses the state correctly
                compositionWidth={300}
                compositionHeight={450}
                fps={30}
                inputProps={{
                  script: videoData.script,
                  audioFileUrl: videoData.audioFileUrl,
                  captions: videoData.captions,
                  imageList: videoData.imageList,
                  setDurationInFrame: (frame: number) =>
                    setDurationInFrame(frame), // Pass the setter here
                }}
                controls={true}
              />
            </DialogDescription>
          </DialogHeader>

          <Button variant="ghost">Cancel</Button>
          <Button>Export</Button>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default PlayerDialog;
