/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import React, { useContext, useEffect, useState } from "react";
import SelectTopic from "./_components/SelectTopic";
import SelectStyle from "./_components/SelectStyle";
import SelectDuration from "./_components/SelectDuration";
import { Button } from "@/components/ui/button";
import CustomLoading from "./_components/CustomLoading";
import { VideoDataContext } from "@/app/_context/VideoDataContext";
import { db } from "@/configs/db";
import { useUser } from "@clerk/nextjs";
import { VideoData } from "@/configs/schema";

interface VideoScriptScene {
  imagePrompt: string;
  contentText: string;
}

interface FormData {
  topic: string;
  imageStyle: string;
  duration: string;
}

interface Caption {
  timestamp: string;
  text: string;
}

function CreateNew() {
  const [loading, setLoading] = useState<boolean>(false);
  const [audioFile, setAudioFile] = useState<string | undefined>();
  const [formData, setFormData] = useState({
    topic: "",
    imageStyle: "",
    duration: "",
  });
  const [videoScript, setVideoScript] = useState([]);
  const [captions, setCaptions] = useState([]);
  const [imageList, setImageList] = useState([]);
  const { videoData, setVideoData } = useContext(VideoDataContext);
  const { user } = useUser();

  const handleInputChange = (fieldName: string, fieldValue: string) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: fieldValue,
    }));
  };

  const getVideoScript = async () => {
    setLoading(true);
    try {
      const prompt = `Write a script to generate ${formData.duration} video on topic: ${formData.topic} along with AI image prompt in ${formData.imageStyle} format for each scene and give me result in JSON format with imagePrompt and contentText as field.`;
      const response = await axios.post("/api/get-video-script", { prompt });

      if (response.data?.result) {
        const scriptData = response.data.result;
        setVideoScript(scriptData);
        setVideoData((prev) => ({
          ...prev,
          videoScript: scriptData,
        }));
        await generateAudioFile(scriptData); // Generate audio after receiving script
      } else {
        throw new Error("Failed to generate video script");
      }
    } catch (error) {
      console.error("Error fetching video script:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateVideo = () => {
    getVideoScript();
  };

  const handleGenerateAudio = async (text: string, id: string) => {
    try {
      const res = await axios.post("/api/generate-audio", { text, id });

      if (res.data?.fileUrl) {
        const fileUrl = res.data.fileUrl;
        setAudioFile(fileUrl);
        setVideoData((prev) => ({
          ...prev,
          audioFile: fileUrl,
        }));
        await generateAudioCaption(fileUrl); // Generate captions after audio is ready
      } else {
        console.error("Error: Missing fileUrl in audio generation response.");
      }
    } catch (error) {
      console.error("Error generating audio:", error);
      setLoading(false);
    }
  };

  const generateAudioFile = async (videoScriptData) => {
    const scriptText = videoScriptData.map((scene) => scene.contentText).join(" ");
    const id = uuidv4(); // Generate unique ID for audio
    await handleGenerateAudio(scriptText, id);
  };

  const generateAudioCaption = async (fileUrl: string) => {
    try {
      const response = await axios.post("/api/generate-caption", { audioFileUrl: fileUrl });

      if (response.data?.Result) {
        const generatedCaptions = response.data.Result;
        setCaptions(generatedCaptions);
        setVideoData((prev) => ({
          ...prev,
          captions: generatedCaptions,
        }));

        await generateImages(videoScript); // Proceed to image generation after captions are ready
      } else {
        console.error("Error: Failed to generate captions");
      }
    } catch (error) {
      console.error("Error generating captions:", error);
    }
  };

  const generateImages = async (videoScriptData:VideoScriptScene[]) => {
    try {
      const images = [];

      // Generate image for each scene
      for (const scene of videoScriptData) {
        const res = await axios.post("/api/generate-image", { prompt: scene.imagePrompt });
        const imageUrl = res.data.result;
        images.push(imageUrl);
      }

      setImageList(images);
      setVideoData((prev) => ({
        ...prev,
        images: images,
      }));
    } catch (error) {
      console.error("Error generating images:", error);
    }
  };

  useEffect(() => {
    if (videoData?.videoScript && videoData?.captions && videoData?.audioFile && videoData?.images) {
      saveVideoData();
    }
  }, [videoData]);

  const saveVideoData = async () => {
    setLoading(true);
    try {
      const result = await db.insert(VideoData).values({
        script: videoData?.videoScript || "",
        captions: videoData?.captions || "",
        audioFileUrl: videoData?.audioFile || "",
        imageList: videoData?.images || [],
        createdBy: user?.primaryEmailAddress?.emailAddress || "",
      }).returning({ id: VideoData.id });

      console.log(result);
    } catch (error) {
      console.error("Error saving video data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="md:px-20">
      <h2 className="font-bold text-4xl text-primary text-center">Create New</h2>
      <div className="mt-10 shadow-md p-10">
        <SelectTopic onUserSelect={handleInputChange} />
        <SelectStyle onUserSelect={handleInputChange} />
        <SelectDuration onUserSelect={handleInputChange} />
        <Button className="mt-4 w-full" onClick={handleCreateVideo}>
          Create Short Video
        </Button>
      </div>
      <CustomLoading loading={loading} />
    </div>
  );
}

export default CreateNew;