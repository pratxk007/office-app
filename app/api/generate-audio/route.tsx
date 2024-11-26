import axios from 'axios';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { NextResponse } from 'next/server';

const API_KEY = 'sk_a23df200f4e35538877fa107fc865244a8b03458fd773399';
const endpoint = 'https://api.elevenlabs.io/v1/text-to-speech/onwK4e9ZLuTAKqWW03F9';

// S3 configuration for uploading to Sufy
const s3 = new S3Client({
  region: 'ap-southeast-2', // Asia Pacific (Hanoi) RegionID
  endpoint: 'https://mos.ap-southeast-2.sufybkt.com', // Sufy Endpoint
  credentials: {
    accessKeyId: process.env.NEXT_SUFY_AK as string,
    secretAccessKey: process.env.NEXT_SUFY_SK as string,
  },
});

export async function POST(req: Request) {
  const { text, id } = await req.json();

  try {
    // Request body to send to Eleven Labs API
    const requestBody = {
      text, // Text to convert to speech
      voice_settings: {
        stability: 1,
        similarity_boost: 1,
        style: 1,
        use_speaker_boost: true,
      },
    };

    // Call Eleven Labs API to generate speech
    const response = await axios.post(endpoint, requestBody, {
      headers: {
        'xi-api-key': API_KEY,
        'Content-Type': 'application/json',
      },
      responseType: 'arraybuffer',  // Expect binary audio data
    });

    // Check if the response contains valid audio data
    if (response.status === 200 && response.data) {
      const audioBuffer = response.data;
      console.log("Received audio buffer, size:", audioBuffer.length);  // Log the size
      if (audioBuffer.length === 0) {
        return NextResponse.json({ message: 'Error: Empty audio buffer' }, { status: 500 });
      }

      // Define Sufy S3 bucket information
      const bucketName = 'ai-shorts'; // Replace with your bucket name
      const key = `audio/${id}.mp3`; // Unique key for the uploaded file

      // Upload the audio file to Sufy cloud storage using S3
      const uploadParams = {
        Bucket: bucketName,
        Key: key,
        Body: audioBuffer,
        ContentType: 'audio/mp3',  // Ensure the correct MIME type
      };

      try {
        const uploadResult = await s3.send(new PutObjectCommand(uploadParams));
        console.log('Upload successful:', uploadResult);
        const fileUrl = `https://${bucketName}.mos.ap-southeast-2.sufybkt.com/${key}`;
        return NextResponse.json({ message: 'Audio uploaded successfully', fileUrl });
      } catch (uploadError:any) {
        console.error('Error uploading to Sufy:', uploadError);
        console.error('Error details:', uploadError.message);
        return NextResponse.json({ message: 'Error uploading audio to Sufy', error: uploadError.message }, { status: 500 });
      }
      
    } else {
      return NextResponse.json({ message: 'Error: No audio data returned from API' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error generating audio:', error);
    return NextResponse.json({ message: 'Error generating audio' }, { status: 500 });
  }
}
