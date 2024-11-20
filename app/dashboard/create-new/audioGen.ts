import axios from 'axios';
import * as fs from 'fs'
// Replace this with your Eleven Labs API key and endpoint
const API_KEY = 'sk_a23df200f4e35538877fa107fc865244a8b03458fd773399';
const endpoint = 'https://api.elevenlabs.io/v1/text-to-speech/onwK4e9ZLuTAKqWW03F9';

export const generateAudio = async (text:string) => {
  try {
    // Create the request body
    const requestBody = {
      text, // The text you want to convert to speech
      voice_settings: {
        stability: 1,
        similarity_boost: 1,
        style: 1,
        use_speaker_boost: true,
      }
    };

    // Send the POST request using axios
    const response = await axios.post(endpoint, requestBody, {
      headers: {
        'xi-api-key': API_KEY,
        'Content-Type': 'application/json'
      },
      responseType: 'arraybuffer'  // Ensure the response is in binary (audio) format
    });

    // Handle the audio data received
    const audioBuffer = response.data;

    // Save the audio data to a file (e.g., output.mp3)
    fs.writeFileSync('output.mp3', audioBuffer);

    console.log('Audio file saved as output.mp3');
  } catch (error) {
    console.error('Error generating audio:', error);
  }
};

// Run the generateAudio function

