import { GoogleGenAI, Modality } from "@google/genai";

const SUPPORTED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// Helper to convert any browser-renderable image file to a supported format for the API
const fileToSupportedImage = (file: File): Promise<{ base64: string, mimeType: string }> => {
  return new Promise((resolve, reject) => {
    // If the type is already supported by the API, use it directly
    if (SUPPORTED_MIME_TYPES.includes(file.type)) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        // result is a data URL: "data:image/jpeg;base64,..."
        // we only want the base64 part
        const encoded = (reader.result as string).split(',')[1];
        resolve({ base64: encoded, mimeType: file.type });
      };
      reader.onerror = error => reject(error);
      return;
    }

    // For unsupported types (like AVIF, GIF), convert to JPEG using a canvas
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onerror = error => reject(error);
    reader.onload = (readerEvent) => {
      const image = new Image();
      image.onerror = error => reject(new Error("Failed to load image for conversion."));
      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Could not get canvas context for image conversion.'));
        }
        ctx.drawImage(image, 0, 0);
        
        // Convert to JPEG, a widely supported format, with 95% quality
        const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
        const encoded = dataUrl.split(',')[1];
        resolve({ base64: encoded, mimeType: 'image/jpeg' });
      };
      image.src = readerEvent.target?.result as string;
    };
  });
};


export const generateImage = async (imageFile: File, prompt: string): Promise<string> => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable is not set.");
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const { base64: base64ImageData, mimeType: processedMimeType } = await fileToSupportedImage(imageFile);

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    {
                        inlineData: {
                            data: base64ImageData,
                            mimeType: processedMimeType,
                        },
                    },
                    {
                        text: prompt,
                    },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });
        
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                const base64ImageBytes: string = part.inlineData.data;
                // Gemini API returns a base64 string. We need to prepend the data URI scheme.
                // The API doesn't specify the output format, so PNG is a safe bet.
                return `data:image/png;base64,${base64ImageBytes}`;
            }
        }
        throw new Error("No image data found in the API response.");

    } catch (error: any) {
        console.error("Error generating image with Gemini:", error);

        // Check for specific error messages from the API response
        if (error.message && (error.message.includes("RESOURCE_EXHAUSTED") || error.message.includes("429"))) {
            throw new Error("Rate limit exceeded. Please wait a little while before trying again.");
        }
        
        // Try to parse for a cleaner message from the API
        try {
            // Gemini SDK errors often have a stringified JSON in the message
            const parsedError = JSON.parse(error.message);
            if (parsedError.error && parsedError.error.message) {
                throw new Error(parsedError.error.message);
            }
        } catch (e) {
            // Parsing failed, fall back to the original message or a generic one
        }
        
        throw new Error(error.message || "Failed to generate image. Please check the console for more details.");
    }
};
