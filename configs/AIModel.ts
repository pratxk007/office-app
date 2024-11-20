const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } = require("@google/generative-ai");
  
  const apiKey = process.env.NEXT_GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });
  
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
  };
  

     export const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            {text: "Write a script to generate 30 seconds video on topic: Interesting Historical story along with AI image prompt in Realistic format for each scene and give me result in JSON format with imagePrompt and contentText as field"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "```json\n[\n  {\n    \"imagePrompt\": \"Realistic painting of a bustling medieval marketplace, vibrant colors, people in period clothing buying and selling goods, cobblestone streets, a large wooden sign hanging above a stall reading \\\"The Golden Goose Inn\\\"\",\n    \"contentText\": \"Our story begins in 14th-century England, a time of great change and upheaval. Imagine a bustling marketplace, the air thick with the smells of roasting meats and spices...\"\n  },\n  {\n    \"imagePrompt\": \"Realistic portrait of a young woman with determined eyes, wearing a simple but elegant medieval dress, holding a quill and a scroll, a slight smile playing on her lips\",\n    \"contentText\": \"Our protagonist, Elara, was no ordinary woman.  A skilled scribe, she possessed a keen intellect and a thirst for knowledge, unusual for a woman of her time.\"\n  },\n  {\n    \"imagePrompt\": \"Realistic depiction of a shadowy, dimly lit castle courtyard at night, a single flickering torch illuminating a clandestine meeting between Elara and a hooded figure\",\n    \"contentText\": \"One night, a mysterious figure approached her, offering a dangerous proposition: to secretly transcribe a forbidden manuscript...\"\n  },\n  {\n    \"imagePrompt\": \"Realistic illustration of a beautifully illuminated manuscript page, filled with intricate calligraphy and drawings, open on a table in a dimly lit room\",\n    \"contentText\": \"The manuscript contained secrets that could shake the foundations of the kingdom, stories of forgotten magic and powerful prophecies...\"\n  },\n  {\n    \"imagePrompt\": \"Realistic image of a grand cathedral interior at dawn, stained glass windows casting colorful light on a solemn ceremony, Elara observing from the shadows\",\n    \"contentText\": \"As Elara transcribed, she discovered the truth about the kingdom's history, a truth hidden for centuries, and a plot to undermine the rightful heir to the throne...\"\n  },\n  {\n    \"imagePrompt\": \"Realistic scene of a thrilling chase through the castle's labyrinthine corridors, Elara running, pursued by guards with torches, a sense of urgency and danger\",\n    \"contentText\": \"With the manuscript in her possession, Elara found herself caught in a deadly game of cat and mouse, pursued by those who sought to silence her forever.\"\n  },\n  {\n    \"imagePrompt\": \"Realistic close-up of Elara's determined face, a mixture of fear and resolve in her eyes, clutching the manuscript tightly, a hint of dawn breaking through a window\",\n    \"contentText\": \"But Elara was not one to be easily defeated.  Her courage and intelligence would be her greatest weapons in this fight for truth and justice...\"\n  }\n]\n```\n\n**Note:**  This JSON provides the prompts and text for a *story outline*. To create a 30-second video, you'll need to use video editing software and AI image generation tools (like Midjourney, DALL-E 2, Stable Diffusion) to create the visuals from the prompts.  Each scene would need to be relatively short (around 3-5 seconds) to fit within the 30-second timeframe. You would need to synchronize the text with the visuals during the video editing process.  The pacing and transitions between scenes would be crucial for a compelling 30-second video.  The realism of the AI-generated images depends heavily on the capabilities of the specific AI art generator used.\n"},
          ],
        },
      ],
    });
  
