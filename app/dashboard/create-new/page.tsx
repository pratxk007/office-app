'use client';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import React, { useState } from 'react';
import SelectTopic from './_components/SelectTopic';
import SelectStyle from './_components/SelectStyle';
import SelectDuration from './_components/SelectDuration';
import { Button } from '@/components/ui/button';
import CustomLoading from './_components/CustomLoading';

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
let imageData  = [
  {
    "imagePrompt": "Photorealistic image of a fluffy, orange cat sitting on a windowsill, looking out at a bustling city street below.  Sunbeams illuminating the cat's fur.",
    "contentText": "Bartholomew the cat surveyed his kingdom from his usual perch.  The city below was a symphony of noise and chaos."
  },
  {
    "imagePrompt": "Photorealistic image of a small, rusty robot meticulously polishing a single, perfect red apple.",
    "contentText": "Unit 734, a surprisingly dexterous robot, had a secret passion: apple polishing. He believed in perfection."
  },
  {
    "imagePrompt": "Photorealistic image of a group of friendly-looking squirrels wearing tiny hats and drinking tea from miniature teacups in a miniature garden.",
    "contentText": "The annual Squirrel Tea Party was underway.  This year's theme: miniature topiary."
  },
  {
    "imagePrompt": "Photorealistic image of a cloud shaped like a giant, smiling whale floating across a clear blue sky.",
    "contentText": "Whaley, the cloud whale, was in a playful mood. He decided to spray a bit of rain on the unsuspecting park below."
  },
  {
    "imagePrompt": "Photorealistic image of a group of penguins playing ice hockey on a frozen pond, with a penguin referee wearing a tiny striped shirt.",
    "contentText": "The annual Penguin Ice Hockey Championship was a fierce but fun competition. The stakes were high: bragging rights for a year!"
  },
  {
    "imagePrompt": "Photorealistic image of a wise old owl perched on a branch, reading a book by moonlight.",
    "contentText": "Professor Sophocles, the owl, was engrossed in a particularly fascinating chapter about the history of acorns."
  }
]


function CreateNew() {
  const [loading, setLoading] = useState<boolean>(false);
  const [audioFile, setAudioFile] = useState<string | undefined>();
  const [formData, setFormData] = useState<FormData>({ topic: '', imageStyle: '', duration: '' });
  const [videoScript, setVideoScript] = useState<VideoScriptScene[]>([]);
  const [captions, setCaptions] = useState<Caption[]>([]);
  const [imageList, setImageList] = useState<String[]>([])

  // Handle form input changes
  const handleInputChange = (fieldName: string, fieldValue: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: fieldValue,
    }));
  };

  
  // Request the video script based on user input
  const getVideoScript = async () => {
    try {
      setLoading(true);
      const prompt = `Write a script to generate ${formData.duration} video on topic: ${formData.topic} along with AI image prompt in ${formData.imageStyle} format for each scene and give me result in JSON format with imagePrompt and contentText as field.`;
      const response = await axios.post('/api/get-video-script', { prompt });

      if (response.data?.result) {
        const scriptData = response.data.result;
        setVideoScript(scriptData);
        await generateAudioFile(scriptData);  // Generate audio after receiving the script
      } else {
        throw new Error('Failed to generate video script');
      }
    } catch (error) {
      console.error('Error fetching video script:', error);
      setLoading(false);
    }
  };

  // Create video by requesting a video script
  const handleCreateVideo = () => {
    getVideoScript();
    // generateImages()
  };

  // Generate audio file based on the script text
  const handleGenerateAudio = async (text: string, id: string) => {
    try {
      const { data } = await axios.post('/api/generate-audio', { text, id });

      if (data?.fileUrl) {
        console.log('Audio file generated at:', data.fileUrl);
        setAudioFile(data.fileUrl);  // Set the generated audio URL
        await generateAudioCaption(data.fileUrl);  // Generate captions after audio file URL is ready
      } else {
        throw new Error('Failed to generate audio');
      }
    } catch (error) {
      console.error('Error generating audio:', error);
      setLoading(false);
    }
  };

  // Generate the audio file for the entire video script
  const generateAudioFile = async (videoScriptData: VideoScriptScene[]) => {
    const script = videoScriptData.map(scene => scene.contentText).join(' '); // Concatenate all scene contentText
    const id = uuidv4(); // Generate a unique ID for each audio file

    await handleGenerateAudio(script, id);
  };

  // Generate captions from the audio file URL
  // Generate captions from the audio file URL
const generateAudioCaption = async (fileUrl: string) => {
    try {
        console.log("Generating captions for audio file:", fileUrl);  // Debug log
        const response = await axios.post('/api/generate-caption', { audioFileUrl: fileUrl });

        // Log the full response to ensure structure is correct
        console.log("Caption API response:", response.data);

        if (response.data?.Result) {
            console.log('Generated captions:', response.data.Result);
            setCaptions(response.data.Result);  // Set the captions
            await generateImages();  // Proceed to image generation after captions are ready
        } else {
            throw new Error('Failed to generate captions');
        }
    } catch (error) {
        console.error('Error generating captions:', error);
    } finally {
        setLoading(false);  // Ensure loading is set to false after the process is done
    }
};


  const generateImages = async () => {
    try {
      const imagePromises = videoScript.map(async (scene, index) => {
        await new Promise(resolve => setTimeout(resolve, 1000));  // Wait 1 second between requests
  
        const response = await axios.post('/api/generate-image', { text: scene.imagePrompt });
        return response.data?.result; // Return image result
      });
  
      const images = await Promise.all(imagePromises);
      console.log(images);
      setImageList(images);  // Update the state with the generated images
    } catch (error) {
      console.error('Error generating images:', error);
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
