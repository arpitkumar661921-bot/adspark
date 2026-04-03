import { openai } from "@ai-sdk/openai";
import { generateObject, generateText } from "ai";
import { z } from "zod";
import { getEnv } from "@/lib/env";

const adSchema = z.object({
  headline: z.string(),
  body: z.string(),
  cta: z.string()
});

const adSetSchema = z.object({
  ads: z.array(adSchema).length(3),
  imagePrompts: z.array(z.string()).length(3),
  videoStoryboard: z.array(z.string()).length(4)
});

export async function generateAdsBundle(input: string, platform: string) {
  getEnv();

  const { object } = await generateObject({
    model: openai("gpt-4.1-mini"),
    schema: adSetSchema,
    prompt: `Generate ad creative for ${platform}. Input: ${input}. Return exactly 3 ads, 3 image prompts, 4 video storyboard frames.`
  });

  const visuals = object.imagePrompts.map((prompt) =>
    `https://image.pollinations.ai/prompt/${encodeURIComponent(`${prompt} for ${platform} product ad`)}`
  );

  const { text: narration } = await generateText({
    model: openai("gpt-4.1-mini"),
    prompt: `Create a concise 20-second video narration script from these frames: ${object.videoStoryboard.join(" | ")}`
  });

  return {
    ads: object.ads,
    images: visuals,
    video: {
      frames: object.videoStoryboard,
      narration,
      fallback: "Use frame sequence and narration for CapCut/Canva auto-video rendering."
    }
  };
}
