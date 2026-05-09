import { defineCollection, z } from "astro:content";

const claims = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    number: z.number().int().min(1).max(10),
    shortTitle: z.string().optional(),
    verdict: z.enum([
      "VINDICATED",
      "PLAUSIBLE",
      "CONTESTED",
      "SPLIT",
      "REFUTED",
      "UNFALSIFIABLE",
    ]),
    personas: z.array(z.string()).length(2),
    thread: z.enum(["memory", "architecture", "metacognition", "social"]),
    date: z.string(),
    description: z.string(),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { claims };
