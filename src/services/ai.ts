// AI Service for Cutverse AI using Bytez SDK
// Direct integration with bytez.js SDK

import Bytez from "bytez.js";

const API_KEY = "cd8fe321d2c8864355dcc151f435f41f";

// Initialize Bytez SDK
const sdk = new Bytez(API_KEY);

// Clean text by removing restricted characters
export function cleanText(text: string): string {
  return text
    .replace(/#/g, '')
    .replace(/\*/g, '')
    .replace(/'/g, '')
    .replace(/`/g, '')
    .trim();
}

// Format text with bold title and emphasized words
export function formatOutputText(text: string): string {
  const cleaned = cleanText(text);
  const lines = cleaned.split('\n');
  
  if (lines.length > 0) {
    // Make first non-empty line bold as title
    const firstLineIndex = lines.findIndex(line => line.trim().length > 0);
    if (firstLineIndex >= 0) {
      lines[firstLineIndex] = `<strong class="text-lg font-bold text-white">${lines[firstLineIndex]}</strong>`;
    }
  }
  
  // Bold some important phrases
  const keywords = [
    'Important', 'Key Point', 'Note', 'Conclusion', 'Summary', 'Introduction',
    'Therefore', 'However', 'Moreover', 'Furthermore', 'In conclusion', 'To summarize',
    'Dear', 'Respected', 'Subject', 'Date', 'Sincerely', 'Yours', 'Main Point',
    'First', 'Second', 'Third', 'Finally', 'Body', 'Opening', 'Closing',
    'Arguments', 'Counter', 'Rebuttal', 'Evidence', 'Example', 'Result',
    'HOOK', 'INTRO', 'INTRODUCTION', 'MAIN CONTENT', 'CALL TO ACTION', 'OUTRO',
    'Paragraph', 'Para', 'Section'
  ];
  
  let result = lines.join('\n');
  keywords.forEach(keyword => {
    const regex = new RegExp(`\\b(${keyword})\\b`, 'gi');
    result = result.replace(regex, '<strong class="font-semibold text-blue-300">$1</strong>');
  });
  
  return result;
}

// Text Generation using Bytez SDK with gpt-4o
export async function generateText(prompt: string, systemPrompt?: string): Promise<{ error: string | null; output: string }> {
  try {
    // Choose gpt-4o model
    const model = sdk.model("openai/gpt-4o");
    
    // Build messages array
    const messages: Array<{ role: string; content: string }> = [];
    
    if (systemPrompt) {
      messages.push({ role: "system", content: systemPrompt });
    }
    
    messages.push({ role: "user", content: prompt });
    
    // Send input to model using the SDK
    const result = await model.run(messages);
    
    // Check for errors
    if (result.error) {
      console.error('Bytez API error:', result.error);
      return { error: String(result.error), output: '' };
    }
    
    // Extract the text from the response
    let outputText = '';
    
    if (typeof result.output === 'string') {
      outputText = result.output;
    } else if (result.output?.choices?.[0]?.message?.content) {
      outputText = result.output.choices[0].message.content;
    } else if (result.output?.content) {
      outputText = result.output.content;
    } else if (result.output?.message?.content) {
      outputText = result.output.message.content;
    } else if (Array.isArray(result.output)) {
      outputText = result.output.map((item: any) => {
        if (typeof item === 'string') return item;
        return item.content || item.text || item.message?.content || '';
      }).join('');
    } else if (typeof result.output === 'object' && result.output !== null) {
      const output = result.output as any;
      if (output.text) {
        outputText = output.text;
      } else if (output.response) {
        outputText = output.response;
      } else {
        // Try to extract any text content
        try {
          outputText = JSON.stringify(result.output);
        } catch {
          outputText = String(result.output);
        }
      }
    }
    
    if (!outputText) {
      return { error: 'No output received from API', output: '' };
    }
    
    return { error: null, output: cleanText(outputText) };
  } catch (err: any) {
    console.error('Text generation error:', err);
    return { error: err.message || 'Failed to generate text', output: '' };
  }
}

// Image Generation using Bytez SDK with stable-diffusion-xl-base-1.0
export async function generateImage(prompt: string): Promise<{ error: string | null; output: string }> {
  try {
    // Choose stable-diffusion-xl-base-1.0 model
    const model = sdk.model("stabilityai/stable-diffusion-xl-base-1.0");
    
    // Send input to model using the SDK
    const result = await model.run(prompt);
    
    // Check for errors
    if (result.error) {
      console.error('Bytez API error:', result.error);
      return { error: String(result.error), output: '' };
    }
    
    // Handle different response formats
    let imageData = '';
    
    if (result.output instanceof Blob) {
      imageData = URL.createObjectURL(result.output);
    } else if (typeof result.output === 'string') {
      imageData = result.output;
    } else if (result.output?.image) {
      imageData = result.output.image;
    } else if (result.output?.url) {
      imageData = result.output.url;
    } else if (result.output?.images?.[0]) {
      imageData = result.output.images[0];
    } else if (result.output?.base64) {
      imageData = `data:image/png;base64,${result.output.base64}`;
    } else if (Array.isArray(result.output) && result.output.length > 0) {
      const firstItem = result.output[0];
      if (firstItem instanceof Blob) {
        imageData = URL.createObjectURL(firstItem);
      } else if (typeof firstItem === 'string') {
        imageData = firstItem;
      } else if (firstItem?.url) {
        imageData = firstItem.url;
      } else if (firstItem?.image) {
        imageData = firstItem.image;
      }
    }
    
    // Ensure proper data URI format for base64
    if (imageData && !imageData.startsWith('http') && !imageData.startsWith('data:') && !imageData.startsWith('blob:')) {
      imageData = `data:image/png;base64,${imageData}`;
    }
    
    if (!imageData) {
      return { error: 'No image received from API', output: '' };
    }
    
    return { error: null, output: imageData };
  } catch (err: any) {
    console.error('Image generation error:', err);
    return { error: err.message || 'Failed to generate image', output: '' };
  }
}
