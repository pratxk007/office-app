import axios from "axios";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

// API Keys Array
const apiKeys = [
    process.env.NEXT_RAPID_API_1,
    process.env.NEXT_RAPID_API_2,
    process.env.NEXT_RAPID_API_3,
    process.env.NEXT_RAPID_API_4,
];

// Simulate Request Tracking (you can use a more advanced tracking system here)
let apiKeyRequestCounts = {
    [process.env.NEXT_RAPID_API_1 as string]: { monthly: 0, hourly: 0 },
    [process.env.NEXT_RAPID_API_2 as string]: { monthly: 0, hourly: 0 },
    [process.env.NEXT_RAPID_API_3 as string]: { monthly: 0, hourly: 0 },
    [process.env.NEXT_RAPID_API_4 as string]: { monthly: 0, hourly: 0 },
};

// S3 configuration for uploading to Sufy
const s3 = new S3Client({
    region: 'ap-southeast-2', // Asia Pacific (Hanoi) RegionID
    endpoint: 'https://mos.ap-southeast-2.sufybkt.com', // Sufy Endpoint
    credentials: {
        accessKeyId: process.env.NEXT_SUFY_AK as string,
        secretAccessKey: process.env.NEXT_SUFY_SK as string,
    },
});

// Function to handle making the API request
const makeRequest = async (apiKey: string, text: string) => {
    const url = 'https://ai-text-to-image-generator-api.p.rapidapi.com/realistic'; // Update to correct endpoint if needed

    const options = {
        method: 'POST',
        url: url,
        headers: {
            'x-rapidapi-key': apiKey,
            'x-rapidapi-host': 'ai-text-to-image-generator-api.p.rapidapi.com',
            'Content-Type': 'application/json',
        },
        data: {
            inputs: text,
        },
    };

    try {
        const response = await axios.request(options); // Make the API request
        // Update request counts on success
        apiKeyRequestCounts[apiKey as string].hourly += 1;
        apiKeyRequestCounts[apiKey as string].monthly += 1;
        return response.data.url; // Return the response data
    } catch (error: any) {
        if (error.response && error.response.status === 429) {
            console.error(`API Key ${apiKey} is rate-limited. Switching to the next one.`);
            return null; // Return null to trigger key rotation
        } else {
            console.error(`Error with API Key ${apiKey}: ${error.message}`);
            return null; // Return null for other errors to try with a new key
        }
    }
};

// Function to rotate through API keys until one succeeds
const generateImageWithKeyRotation = async (text: string) => {
    for (let i = 0; i < apiKeys.length; i++) {
        const apiKey = apiKeys[i];

        // Check if the API key has exceeded its monthly or hourly limit
        if (
            apiKeyRequestCounts[apiKey as string].monthly >= 20 ||
            apiKeyRequestCounts[apiKey as string].hourly >= 1000
        ) {
            console.log(`API Key ${apiKey} has exceeded its limit. Skipping.`);
            continue; // Skip this key if it's out of quota
        }

        // Make the API request and return the result if successful
        const result = await makeRequest(apiKey as string, text);
        if (result) {
            return result; // If request is successful, return the image result
        }
    }

    // If no API keys are available (all limits exceeded or errors), return an error
    return { error: "Error creating the image, please try later." };
};

// Function to upload the image to Sufy S3
const uploadImageToSufy = async (imageUrl: string, fileName: string) => {
    try {
        const res = await axios.get(imageUrl, { responseType: "arraybuffer" });

        const imageBuffer = Buffer.from(res.data);
        const uploadParams = {
            Bucket: "ai-shorts", // Your Sufy bucket name
            Key: fileName, // Unique file name
            Body: imageBuffer, // The image data
            ContentType: "image/png", // Correct MIME type for image
        };

        // Upload to Sufy
        const uploadResult = await s3.send(new PutObjectCommand(uploadParams));
        console.log("Upload successful:", uploadResult);

        // Return the Sufy URL for the uploaded image
        const fileUrl = `https://ai-shorts.mos.ap-southeast-2.sufybkt.com/${fileName}`;
        return fileUrl;
    } catch (error) {
        console.error("Error uploading image to Sufy:", error);
        throw new Error("Error uploading image to Sufy");
    }
};

export async function POST(req: Request) {
    const { text } = await req.json(); // Get the text prompt from the client request

    // Attempt to generate image with key rotation
    const result = await generateImageWithKeyRotation(text);

    if (result.error) {
        return NextResponse.json({ error: result.error }, { status: 500 });
    }

    // Convert image and upload it to Sufy
    const base64 = 'data:image/png;base64,' + await convertImage(result);
    const fileName = `images/${Date.now()}.png`; // Unique file name using timestamp
    const uploadedImageUrl = await uploadImageToSufy(result, fileName);

    // Return the uploaded image URL
    return NextResponse.json({ imageUrl: uploadedImageUrl });
}

// Function to convert image URL to Base64 (optional if needed)
const convertImage = async (image: string) => {
    try {
        const res = await axios.get(image, { responseType: "arraybuffer" });
        const base64Image = Buffer.from(res.data).toString("base64");
        return base64Image;
    } catch (error) {
        console.log(error);
        throw new Error("Error converting image to base64");
    }
};
