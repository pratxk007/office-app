import axios from 'axios';
import * as fs from 'fs';
import { NextResponse } from 'next/server';

const API_KEY = 'sk_a23df200f4e35538877fa107fc865244a8b03458fd773399';
const endpoint = 'https://api.elevenlabs.io/v1/text-to-speech/onwK4e9ZLuTAKqWW03F9';

export async function POST(req: Request) {
  const { text } = await req.json();

  try {
    // Request body to send to Eleven Labs API
    const requestBody = {
      text, // Text to convert to speech
      voice_settings: {
        stability: 1,
        similarity_boost: 1,
        style: 1,
        use_speaker_boost: true,
      }
    };

    // Call Eleven Labs API to generate speech
    const response = await axios.post(endpoint, requestBody, {
      headers: {
        'xi-api-key': API_KEY,
        'Content-Type': 'application/json'
      },
      responseType: 'arraybuffer',  // Expect binary audio data
    });

    // Check if the response contains valid audio data
    if (response.status === 200 && response.data) {
      const audioBuffer = response.data;

      // Save audio data to a file (on server-side)
      const filePath = './public/output.mp3'; // Public folder so it can be accessed
      fs.writeFileSync(filePath, audioBuffer);

      return NextResponse.json({ message: 'Audio file saved', path: filePath });
    } else {
      return NextResponse.json({ message: 'Error: No audio data returned from API' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error generating audio:', error);
    return NextResponse.json({ message: 'Error generating audio' }, { status: 500 });
  }
}
