import { AssemblyAI } from 'assemblyai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { audioFileUrl } = await req.json(); // Fix variable name from 'audioFIleUrl' to 'audioFileUrl'
        const client = new AssemblyAI({
            apiKey: process.env.NEXT_ASSEMBLY_API as string
        });

        const FILE_URL = audioFileUrl; // URL of the audio file

        const data = {
            audio: FILE_URL
        };

        // Start transcribing the audio
        const transcript = await client.transcripts.transcribe(data);

        // Return the transcribed result in the response
        return NextResponse.json({ 'Result': transcript.words });

    } catch (error:any) {
        console.error(error);

        // Return error response with appropriate status code
        return NextResponse.json({ 'Error': error.message }, { status: 500 });
    }
}
