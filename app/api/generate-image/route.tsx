import axios from "axios";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import Replicate from "replicate";

// S3 configuration for uploading to Sufy
const s3 = new S3Client({
    region: 'ap-southeast-2', // Asia Pacific (Hanoi) RegionID
    endpoint: 'https://mos.ap-southeast-2.sufybkt.com', // Sufy Endpoint
    credentials: {
        accessKeyId: process.env.NEXT_SUFY_AK as string,
        secretAccessKey: process.env.NEXT_SUFY_SK as string,
    },
});

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
    const { prompt } = await req.json(); // Get the text prompt from the client request

    const replicate = new Replicate({
        auth: process.env.REPLICATE_API_TOKEN
    });

    const input = {
        prompt,
        height: 1280,
        width: 1024,
        num_outputs: 1
    };

    let output;

    try {
        // Cast the result to string[] (array of strings), adjust this type if needed based on actual output structure
        output = await replicate.run(
            "bytedance/sdxl-lightning-4step:5599ed30703defd1d160a25a63321b4dec97101d98b4674bcc56e41f62f35637", 
            { input }
        ) as string[];  // Force TypeScript to treat it as an array of strings
    } catch (error) {
        console.error("Error running Replicate model:", error);
        throw new Error("Error generating image");
    }

    // Check if output is actually an array before accessing it
    if (!Array.isArray(output) || output.length === 0) {
        throw new Error("Replicate output is not a valid array");
    }

    // Now that we know output is an array, safely access the first item
    const imageUrl = output[0]; // Assume output[0] is a valid image URL

    const base64 = 'data:image/png;base64,' + await convertImage(imageUrl);
    const fileName = `images/${Date.now()}.png`; // Unique file name using timestamp
    const uploadedImageUrl = await uploadImageToSufy(base64, fileName);

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
