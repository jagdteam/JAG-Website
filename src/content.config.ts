import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const projects = defineCollection({
  loader: glob({ base: "./src/content/projects", pattern: "**/*.md" }),
  schema: z.object({
    name: z.string(),
    status: z.string(),
    order: z.number(),
    oneLiner: z.string(),
    team: z.array(z.string()),
    tags: z.array(z.string()),
    description: z.string().optional(),
    thumb: z.string().optional(),
    media: z
      .array(
        z.object({
          src: z.string(),
          alt: z.string(),
          kind: z.enum(["image", "gif", "video"]),
        }),
      )
      .optional(),
    explore: z.object({ href: z.string(), label: z.string() }).optional(),
    repo: z.string().url().optional(),
    demo: z.string().url().optional(),
    draft: z.boolean().optional(),
  }),
});

const people = defineCollection({
  loader: glob({ base: "./src/content/people", pattern: "**/*.md" }),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    github: z.string(),
    photo: z.string(),
  }),
});

export const collections = { projects, people };
