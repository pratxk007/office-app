'use client'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid';
import React, { useState } from 'react';
import SelectTopic from './_components/SelectTopic';
import SelectStyle from './_components/SelectStyle';
import SelectDuration from './_components/SelectDuration';
import { Button } from '@/components/ui/button';
import CustomLoading from './_components/CustomLoading';
import { generateAudio } from './audioGen';

// Define the interface for the video script structure
interface VideoScriptScene {
    imagePrompt: string;
    contentText: string;
}

interface FormData {
    [key: string]: string; // Allows dynamic keys for form data
}

function CreateNew() {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<FormData>({}); // Typing formData as an object with string keys and values
    const [videoScript, setVideoScript] = useState<VideoScriptScene[]>([]); // Typing videoScript as an array of VideoScriptScene objects

    function handleInputChange(fieldName: string, fieldValue: string) {
        setFormData((prev) => ({
            ...prev,
            [fieldName]: fieldValue,
        }));
    }

    const getVideoScript = async () => {
        try {
            setLoading(true);
            const prompt = 'Write a script to generate ' + formData.duration + ' video on topic: ' + formData.topic + ' along with AI image prompt in ' + formData.imageStyle + ' format for each scene and give me result in JSON format with imagePrompt and contentText as field.';
            console.log(prompt);
            const res = await axios.post('/api/get-video-script', {
                prompt: prompt
            });
            console.log(res.data.result);
            setVideoScript(res.data.result); // Now TypeScript knows about the structure of each scene
            generateAudioFile(res.data.result);
            setLoading(false);
        } catch (error) {
            console.error(error);
        }
    }

    // let data = [
    //     {
    //       "imagePrompt": "Photorealistic image of a fluffy, orange cat sitting on a windowsill, looking out at a bustling city street below.  Sunbeams illuminating the cat's fur.",
    //       "contentText": "Bartholomew the cat surveyed his kingdom from his usual perch.  The city below was a symphony of noise and chaos."
    //     },
    //     {
    //       "imagePrompt": "Photorealistic image of a small, rusty robot meticulously polishing a single, perfect red apple.",
    //       "contentText": "Unit 734, a surprisingly dexterous robot, had a secret passion: apple polishing. He believed in perfection."
    //     },
    //     {
    //       "imagePrompt": "Photorealistic image of a group of friendly-looking squirrels wearing tiny hats and drinking tea from miniature teacups in a miniature garden.",
    //       "contentText": "The annual Squirrel Tea Party was underway.  This year's theme: miniature topiary."
    //     },
    //     {
    //       "imagePrompt": "Photorealistic image of a cloud shaped like a giant, smiling whale floating across a clear blue sky.",
    //       "contentText": "Whaley, the cloud whale, was in a playful mood. He decided to spray a bit of rain on the unsuspecting park below."
    //     },
    //     {
    //       "imagePrompt": "Photorealistic image of a group of penguins playing ice hockey on a frozen pond, with a penguin referee wearing a tiny striped shirt.",
    //       "contentText": "The annual Penguin Ice Hockey Championship was a fierce but fun competition. The stakes were high: bragging rights for a year!"
    //     },
    //     {
    //       "imagePrompt": "Photorealistic image of a wise old owl perched on a branch, reading a book by moonlight.",
    //       "contentText": "Professor Sophocles, the owl, was engrossed in a particularly fascinating chapter about the history of acorns."
    //     }
    //   ]
    const handleCreateVideo = () => {
        getVideoScript();
    }

    async function handleGenerateAudio(text: string) {
        const response = await fetch('/api/generate-audio', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text }), // Replace with dynamic text as needed
        });

        const result = await response.json();
        if (result.path) {
            console.log('Audio file generated at:', result.path);
        } else {
            console.error('Error generating audio:', result.message);
        }
    }

    const generateAudioFile = async (videoScriptData: VideoScriptScene[]) => {
        let script = '';
        let id = uuidv4();
        videoScriptData && videoScriptData.forEach((scene) => {
            script += scene.contentText + ' '; // Accessing contentText without any error
        });
        // console.log(script)
        try {
            handleGenerateAudio(script)
        } catch (error) {
            console.error(error);
        }
    }



    return (
        <div className="md:px-20">
            <h2 className="font-bold text-4xl text-primary text-center">Create New</h2>
            <div className="mt-10 shadow-md p-10">
                <SelectTopic onUserSelect={handleInputChange} />
                <SelectStyle onUserSelect={handleInputChange} />
                <SelectDuration onUserSelect={handleInputChange} />
                <Button className='mt-4 w-full' onClick={handleCreateVideo}>Create Short Video</Button>
            </div>
            <CustomLoading loading={loading} />
        </div>
    );
}

export default CreateNew;
